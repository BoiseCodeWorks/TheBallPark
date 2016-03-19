using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebApi.Models
{
	public class Team : Resource
	{
		public string Name { get; set; }

		[JsonIgnore, InverseProperty("HomeTeam")]
		public ICollection<Game> HomeGames { get; set; }

		[JsonIgnore, InverseProperty("AwayTeam")]
		public ICollection<Game> AwayGames { get; set; }
		[JsonIgnore]
		public ICollection<Player> Players { get; set; } = new List<Player>();
	}

	public class Player : Resource
	{
		public int Number { get; set; }
		public string Position { get; set; }
		public int TeamId { get; set; }

		[JsonIgnore]
		public Team Team { get; set; }
	}

	public class Game : Resource
	{
		[ForeignKey("HomeTeam")]
		public int HomeTeamId { get; set; }

		[ForeignKey("AwayTeam")]
		public int AwayTeamId { get; set; }

		[JsonIgnore]
		public Team HomeTeam { get; set; }

		[JsonIgnore]
		public Team AwayTeam { get; set; }
	}

	public class Resource
	{
		public int Id { get; set; }

		public dynamic Data { get; set; }

		[Column("Data")]
		[JsonIgnore]
		public string JsonData
		{
			get { return JsonConvert.SerializeObject(Data); }
			set
			{
				if (string.IsNullOrEmpty(value)) return;

				var metaData = JsonConvert.DeserializeObject<dynamic>(value);

				Data = metaData ?? new { };
			}
		}
	}
}