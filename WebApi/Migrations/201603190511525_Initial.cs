namespace WebApi.Migrations
{
	using System;
	using System.Data.Entity.Migrations;

	public partial class Initial : DbMigration
	{
		public override void Up()
		{
			CreateTable(
				"dbo.Games",
				c => new
				{
					Id = c.Int(nullable: false, identity: true),
					HomeTeamId = c.Int(nullable: false),
					AwayTeamId = c.Int(nullable: false),
					Data = c.String(),
				})
				.PrimaryKey(t => t.Id)
				.ForeignKey("dbo.Teams", t => t.AwayTeamId)
				.ForeignKey("dbo.Teams", t => t.HomeTeamId)
				.Index(t => t.HomeTeamId)
				.Index(t => t.AwayTeamId);

			CreateTable(
				"dbo.Teams",
				c => new
				{
					Id = c.Int(nullable: false, identity: true),
					Name = c.String(),
					Data = c.String(),
				})
				.PrimaryKey(t => t.Id);

			CreateTable(
				"dbo.Players",
				c => new
				{
					Id = c.Int(nullable: false, identity: true),
					Number = c.Int(nullable: false),
					Position = c.String(),
					TeamId = c.Int(nullable: false),
					Data = c.String(),
				})
				.PrimaryKey(t => t.Id)
				.ForeignKey("dbo.Teams", t => t.TeamId)
				.Index(t => t.TeamId);

		}

		public override void Down()
		{
			DropForeignKey("dbo.Players", "TeamId", "dbo.Teams");
			DropForeignKey("dbo.Games", "HomeTeamId", "dbo.Teams");
			DropForeignKey("dbo.Games", "AwayTeamId", "dbo.Teams");
			DropIndex("dbo.Players", new[] { "TeamId" });
			DropIndex("dbo.Games", new[] { "AwayTeamId" });
			DropIndex("dbo.Games", new[] { "HomeTeamId" });
			DropTable("dbo.Players");
			DropTable("dbo.Teams");
			DropTable("dbo.Games");
		}
	}
}
