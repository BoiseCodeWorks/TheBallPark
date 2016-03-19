using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using WebApi.Models;

namespace WebApi.Controllers
{
	[RoutePrefix("api")]
	public class Resource2Controller : ApiController
	{
		private DataStore _ds;

		public Resource2Controller()
		{
			var context = new BaseballDbContext();
			_ds = new DataStore(context);

			_ds.DR<Game>(g => g
				.Named("games")
				.OnWrite(x => true)
			);

			_ds.DR<Team>(t => t
				.Named("teams")
				.OnWrite(x => true)
			);

			_ds.DR<Player>(p => p
				.Named("players")
				.OnWrite(x => true)
				.BelongsTo<Team>(t => t
					.LocalKey(x => x.TeamId)
					.LocalField(x => x.Team)
					.Parent(true)
				)
			);
		}


		[Route("{*path}")]
		public IHttpActionResult Get(string path)
		{
			var data = _ds.MapRelations(path);
			if (data == null) return NotFound();
			return Ok(data);
		}

		[Route("{resource}")]
		public async Task<IHttpActionResult> Post(string resource, [FromBody] JObject obj)
		{
			try
			{
				var result = _ds.GetDefinition(resource).Create(obj);

				await _ds.Context.SaveChangesAsync();
				return Ok(result);
			}
			catch (Exception ex)
			{
				if (ex is UnauthorizedAccessException)
				{
					return Unauthorized();
				}

				return BadRequest(ex.ToString());
			}
		}

		[Route("{resource}/{id}")]
		public async Task<IHttpActionResult> Put(string resource, string id, JObject obj)
		{
			try
			{
				var result = _ds.GetDefinition(resource).Modify(id, obj);

				await _ds.Context.SaveChangesAsync();
				return Ok(result);
			}
			catch (Exception ex)
			{
				if (ex is UnauthorizedAccessException)
				{
					return Unauthorized();
				}

				return BadRequest(ex.ToString());
			}
		}
	}
}
