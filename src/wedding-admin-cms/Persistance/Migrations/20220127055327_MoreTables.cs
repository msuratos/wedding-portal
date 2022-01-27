using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace wedding_admin_cms.Persistance.Migrations
{
    public partial class MoreTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CeremonyLocation",
                table: "Weddings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ReceptionDate",
                table: "Weddings",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "ReceptionLocation",
                table: "Weddings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Entourages",
                columns: table => new
                {
                    EntourageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EntourageOfWeddingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleIdOfEntourage = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entourages", x => x.EntourageId);
                    table.ForeignKey(
                        name: "FK_Entourages_Roles_RoleIdOfEntourage",
                        column: x => x.RoleIdOfEntourage,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Entourages_Weddings_EntourageOfWeddingId",
                        column: x => x.EntourageOfWeddingId,
                        principalTable: "Weddings",
                        principalColumn: "WeddingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entourages_EntourageOfWeddingId",
                table: "Entourages",
                column: "EntourageOfWeddingId");

            migrationBuilder.CreateIndex(
                name: "IX_Entourages_RoleIdOfEntourage",
                table: "Entourages",
                column: "RoleIdOfEntourage",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Entourages");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropColumn(
                name: "CeremonyLocation",
                table: "Weddings");

            migrationBuilder.DropColumn(
                name: "ReceptionDate",
                table: "Weddings");

            migrationBuilder.DropColumn(
                name: "ReceptionLocation",
                table: "Weddings");
        }
    }
}
