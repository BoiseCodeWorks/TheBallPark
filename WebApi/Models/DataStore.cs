using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using Newtonsoft.Json.Linq;
using WebApi.Helpers;

namespace WebApi.Models
{
	public class DataStore : IDisposable
	{
		public DbContext Context { get; set; }

		public DataStore(DbContext context)
		{
			Context = context;
		}

		private readonly Dictionary<string, object> _definitions = new Dictionary<string, object>();

		public void DefineResource<TEntity>(ResourceDefinition<TEntity> def) where TEntity : class
		{
			def.Name = (string.IsNullOrWhiteSpace(def.Name) ? typeof(TEntity).Name : def.Name).ToLower();
			_definitions[def.Name] = def;
			def.Ds = this;
		}

		public ResourceDefinition<T> GetDefinition<T>(string resourceName) where T : class
		{
			return _definitions[resourceName.ToLower()] as ResourceDefinition<T>;
		}

		public IResourceDefinition<object> GetDefinition(string resourceName)
		{
			return _definitions[resourceName.ToLower()] as IResourceDefinition<object>;
		}

		public void Dispose()
		{
		}

		public dynamic MapRelations(string path)
		{
			//module/1/activity/3/quiz
			var split = Regex.Split(path, "/");
			var paths = new List<Tuple<string, string>>();
			for (var i = 0; i < split.Length; i += 2)
			{
				paths.Add(new Tuple<string, string>(split.ElementAtOrDefault(i), split.ElementAtOrDefault(i + 1)));
			}
			var resource = paths.Last();
			var isSingle = !string.IsNullOrWhiteSpace(resource.Item2);
			var where = isSingle ? "id == " + resource.Item2 : "";
			var lastParent = "";
			if (paths.Count > 1)
			{
				for (int i = paths.Count - 1; i >= 1; i--)
				{
					var store = GetDefinition(paths[i].Item1);
					var rel = store.DsRelations2
						.FirstOrDefault(x =>
							x.RelationType == RelationType.BelongsTo &&
							x.LocalFieldName.Equals(GetDefinition(paths[i - 1].Item1).EntityType.Name,
								StringComparison.CurrentCultureIgnoreCase));

					if (where.Length > 0)
					{
						where += " && ";
						lastParent += lastParent.Length > 0 ? "." : "";
					}

					where += $"{lastParent}{rel.LocalKeyName} == {paths[i - 1].Item2}";
					lastParent = rel.LocalFieldName;
				}
			}

			var models = this.FindAll(resource.Item1);
			if (!string.IsNullOrWhiteSpace(where))
			{
				models = models.Where(where);
			}

			return isSingle ? models.FirstOrDefault() : models;
		}
	}


	public interface IResourceDefinition<out T>
	{
		Type EntityType { get; }
		string Name { get; set; }
		IQueryable<T> FindAll();
		T Find(object id);
		T Create(dynamic model);
		T Modify(object id, dynamic model);
		void Destroy(object id);
		List<IDsRelation> DsRelations2 { get; }
	}


	public class ResourceDefinition<TEntity> : IResourceDefinition<TEntity> where TEntity : class
	{
		public string Name { get; set; }
		public Type EntityType => typeof(TEntity);
		public Expression<Func<TEntity, bool>> Filter { get; set; }
		public Func<TEntity, bool> CanWrite { get; set; }
		public DataStore Ds { get; set; }
		public List<Expression<Func<TEntity, object>>> Includes { get; set; } = new List<Expression<Func<TEntity, object>>>();
		public Func<TEntity, bool> OnDestroy { get; set; }
		public List<IDsRelation> DsRelations2 { get { return DsRelations.Cast<IDsRelation>().ToList(); } }
		public List<DsRelation<TEntity>> DsRelations { get; set; } = new List<DsRelation<TEntity>>();
		public IQueryable<TEntity> FindAll()
		{
			var set = Ds.Context.Set<TEntity>().AsQueryable();
			if (Includes != null && Includes.Any())
			{
				set = set.Include(Includes.ToArray());
			}

			if (Filter != null)
			{
				set = set.Where(Filter);
			}
			return set;
		}

		public TEntity Find(object id)
		{
			//var p1 = "@0";
			//p1 = id is int ? p1 : $"\'{p1}\'";

			return FindAll().Where($"Id == @0", ConvertKey(id.ToString())).FirstOrDefault();
		}

		public void Destroy(object id)
		{
			var entity = Find(id);
			if (entity == null) throw new KeyNotFoundException("Item with the key given was not found.");
			if (OnDestroy(entity))
			{
				Ds.Context.Set<TEntity>().Remove(entity);
			}
		}

		public TEntity Create(dynamic bm)
		{
			var model = ((JObject)bm).ToObject<TEntity>();
			if (!CanWrite(model))
			{
				throw new UnauthorizedAccessException("Not Authorized.");
			}

			return Ds.Context.Set<TEntity>().Add(model);
		}

		public TEntity Modify(object id, dynamic bm)
		{
			if (bm.id == null || bm.id.ToString() != id.ToString()) throw new KeyNotFoundException("Keys do not match.");
			var dest = Find(id);
			if (dest == null) throw new KeyNotFoundException("Item with the key given was not found.");
			Ds.Context.Entry<TEntity>(dest).State = EntityState.Detached;
			var patched = ObjectDiffPatch.PatchObject<TEntity>(dest, bm);
			if (!CanWrite(patched))
			{
				throw new UnauthorizedAccessException("Not Authorized.");
			}

			Ds.Context.Entry<TEntity>(patched).State = EntityState.Modified;

			return patched;
		}

		public ResourceDefinition()
		{
		}

		private static object ConvertKey(string id)
		{
			int intKey;
			if (int.TryParse(id, out intKey))
			{
				return intKey;
			}
			return id;
		}

	}

	public enum RelationType
	{
		BelongsTo,
		HasOne,
		HasMany
	}

	public class ResourceDefinitionBuilder<T> where T : class
	{
		private readonly DataStore _dataStore;
		private string _name;
		private Expression<Func<T, bool>> _filter;
		private Func<T, bool> _canWrite;
		private Func<object, bool> _onDestroy;
		private List<DsRelation<T>> _relations { get; set; } = new List<DsRelation<T>>();
		public List<Expression<Func<T, object>>> _includes { get; set; } = new List<Expression<Func<T, object>>>();

		public ResourceDefinitionBuilder(DataStore dataStore)
		{
			_dataStore = dataStore;
		}

		public ResourceDefinitionBuilder<T> Named(string name)
		{
			_name = name;
			return this;
		}

		public ResourceDefinitionBuilder<T> OnRead(Expression<Func<T, bool>> expression)
		{
			_filter = expression;
			return this;
		}

		public ResourceDefinitionBuilder<T> OnWrite(Func<T, bool> expression)
		{
			_canWrite = expression;
			return this;
		}

		public ResourceDefinitionBuilder<T> IncludeConditional(bool condition, params Expression<Func<T, object>>[] includes)
		{
			if (condition) _includes.AddRange(includes);
			return this;
		}

		public ResourceDefinitionBuilder<T> Include(params Expression<Func<T, object>>[] includes)
		{
			_includes.AddRange(includes);
			return this;
		}

		public ResourceDefinition<T> Register()
		{
			var rd = new ResourceDefinition<T>()
			{
				Name = _name,
				Filter = _filter,
				CanWrite = _canWrite,
				Includes = _includes,
				OnDestroy = _onDestroy,
				DsRelations = _relations
			};

			_dataStore.DefineResource(rd);
			return rd;
		}

		public void OnDestroy(Func<object, bool> func)
		{
			_onDestroy = func;
		}

		public void BelongsTo<TNav>(Action<DsRelation<T>> config)
		{
			var mappingConfiguration = new DsRelation<T>(typeof(TNav), RelationType.BelongsTo);
			config(mappingConfiguration);
			_relations.Add(mappingConfiguration);
		}
	}


	public interface IDsRelation
	{
		Type RelType { get; set; }
		RelationType RelationType { get; }
		string LocalFieldName { get; }
		string LocalKeyName { get; }
		bool IsParent { get; }
	}

	public class DsRelation<T> : IDsRelation
	{
		public Type RelType { get; set; }
		public RelationType RelationType { get; private set; }
		public string LocalFieldName { get; private set; }
		public string LocalKeyName { get; private set; }
		public bool IsParent { get; private set; }

		public DsRelation(Type relType, RelationType relationType)
		{
			RelType = relType;
			RelationType = relationType;
		}

		public DsRelation<T> LocalField(Expression<Func<T, object>> localFieldName)
		{
			var prop = GetProperty(localFieldName);
			LocalFieldName = prop.Name;
			return this;
		}
		public DsRelation<T> LocalKey(Expression<Func<T, object>> localKeyName)
		{
			var prop = GetProperty(localKeyName);
			LocalKeyName = prop.Name;
			return this;
		}

		public DsRelation<T> Parent(bool isParent = false)
		{
			IsParent = isParent;
			return this;
		}

		public static PropertyInfo GetProperty<T>(Expression<Func<T, object>> expression)
		{
			MemberExpression memberExpression = null;

			if (expression.Body.NodeType == ExpressionType.Convert)
			{
				memberExpression = ((UnaryExpression)expression.Body).Operand as MemberExpression;
			}
			else if (expression.Body.NodeType == ExpressionType.MemberAccess)
			{
				memberExpression = expression.Body as MemberExpression;
			}

			if (memberExpression == null)
			{
				throw new ArgumentException("Not a member access", "expression");
			}

			return memberExpression.Member as PropertyInfo;
		}
	}


	public static class DataStoreUtils
	{
		public static IQueryable<TEntity> FindAll<TEntity>(this DataStore ds, string resourceName)
			where TEntity : class
		{
			return ds.GetDefinition<TEntity>(resourceName).FindAll();
		}

		public static IQueryable<object> FindAll(this DataStore ds, string resourceName)
		{
			return ds.GetDefinition(resourceName).FindAll();
		}

		public static TEntity Find<TEntity>(this DataStore ds, string resourceName, object id)
			where TEntity : class
		{
			return ds.GetDefinition<TEntity>(resourceName).Find(id);
		}

		public static object Find(this DataStore ds, string resourceName, object id)
		{
			var defs = ds.GetDefinition(resourceName);
			return defs.Find(id);
		}

		public static ResourceDefinition<T> DR<T>(this DataStore ds, Action<ResourceDefinitionBuilder<T>> config)
			where T : class
		{
			var mappingConfiguration = new ResourceDefinitionBuilder<T>(ds);
			config(mappingConfiguration);
			return mappingConfiguration.Register();
		}

		public static IQueryable<T> Include<T, TProperty>(this IQueryable<T> src, Expression<Func<T, TProperty>>[] includes)
		{
			foreach (var exp in includes)
			{
				src = src.Include(exp);
			}
			return src;
		}
	}
}