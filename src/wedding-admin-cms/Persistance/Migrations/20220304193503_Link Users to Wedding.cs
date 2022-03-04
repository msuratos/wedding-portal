using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace wedding_admin_cms.Persistance.Migrations
{
    public partial class LinkUserstoWedding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "WeddingId",
                table: "Entourages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UsersToWeddings",
                columns: table => new
                {
                    UsersToWeddingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    WeddingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserRoles = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersToWeddings", x => x.UsersToWeddingId);
                    table.ForeignKey(
                        name: "FK_UsersToWeddings_Weddings_WeddingId",
                        column: x => x.WeddingId,
                        principalTable: "Weddings",
                        principalColumn: "WeddingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entourages_WeddingId",
                table: "Entourages",
                column: "WeddingId");

            migrationBuilder.CreateIndex(
                name: "IX_UsersToWeddings_WeddingId",
                table: "UsersToWeddings",
                column: "WeddingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entourages_Weddings_WeddingId",
                table: "Entourages",
                column: "WeddingId",
                principalTable: "Weddings",
                principalColumn: "WeddingId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entourages_Weddings_WeddingId",
                table: "Entourages");

            migrationBuilder.DropTable(
                name: "UsersToWeddings");

            migrationBuilder.DropIndex(
                name: "IX_Entourages_WeddingId",
                table: "Entourages");

            migrationBuilder.DropColumn(
                name: "WeddingId",
                table: "Entourages");
        }
    }
}
