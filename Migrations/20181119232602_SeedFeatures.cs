using Microsoft.EntityFrameworkCore.Migrations;

namespace vega.Migrations
{
    public partial class SeedFeatures : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO Features (Name) Values('Air Conditioning')");
            migrationBuilder.Sql("INSERT INTO Features (Name) Values('All Wheel Drive')");
            migrationBuilder.Sql("INSERT INTO Features (Name) Values('Anti-lock Break System')");
            migrationBuilder.Sql("INSERT INTO Features (Name) Values('Blue Tooth')");            
            migrationBuilder.Sql("INSERT INTO Features (Name) Values('Cruise Control')");
            migrationBuilder.Sql("INSERT INTO Features (Name) Values('Moon Roof')");            
            migrationBuilder.Sql("INSERT INTO Features (Name) Values('Seat Warmers')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Features WHERE Name='Air Conditioning'");
            migrationBuilder.Sql("DELETE FROM Features WHERE Name='All Wheel Drive'");
            migrationBuilder.Sql("DELETE FROM Features WHERE Name='Anti-lock Break System'");
            migrationBuilder.Sql("DELETE FROM Features WHERE Name='Blue Tooth'");            
            migrationBuilder.Sql("DELETE FROM Features WHERE Name='Cruise Control'");
            migrationBuilder.Sql("DELETE FROM Features WHERE Name='Moon Roof'");            
            migrationBuilder.Sql("DELETE FROM Features WHERE Name='Seat Warmers'");
        }
    }
}
