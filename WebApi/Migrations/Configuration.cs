using WebApi.Models;

namespace WebApi.Migrations
{
	using System;
	using System.Data.Entity;
	using System.Data.Entity.Migrations;
	using System.Linq;

	internal sealed class Configuration : DbMigrationsConfiguration<WebApi.Models.BaseballDbContext>
	{
		public Configuration()
		{
			AutomaticMigrationsEnabled = false;
		}

		protected override void Seed(WebApi.Models.BaseballDbContext context)
		{

			context.Teams.AddOrUpdate(new Team
			{
				Id = 1,
				Data = new { },
				Name = "The Storm",
			},
			new Team
			{
				Id = 2,
				Data = new { },
				Name = "The Bulls",
			});

			context.Games.AddOrUpdate(new Game
			{
				Id = 1,
				Data = new { },
				HomeTeamId = 1,
				AwayTeamId = 2
			});

			context.SaveChanges();
		}
	}
}
