using Microsoft.EntityFrameworkCore.Migrations;

namespace vega.Migrations
{
    public partial class SeedInitialModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO Makes (Name) Values('Ford')");
            migrationBuilder.Sql("INSERT INTO Makes (Name) Values('Honda')");
            migrationBuilder.Sql("INSERT INTO Makes (Name) Values('Toyota')");

            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Ford'), 'Fiesta')");
            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Ford'), 'Mustang')");
            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Ford'), 'Tempo')");

            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Honda'), 'Accord')");
            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Honda'), 'Civic')");
            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Honda'), 'CR-V')");

            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Toyota'), 'Camry')");
            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Toyota'), 'Corolla')");
            migrationBuilder.Sql("INSERT INTO Models (MakeId, Name) Values((SELECT Id From Makes WHERE Name='Toyota'), 'Tacoma')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Models WHERE Name IN ('Fiesta','Mustang','Tempo','Accord','Civic','CR-V','Camry','Corolla','Tacoma')");
            migrationBuilder.Sql("DELETE FROM Makes WHERE Name in ('Ford','Honda','Toyota'");
        }
    }
}
