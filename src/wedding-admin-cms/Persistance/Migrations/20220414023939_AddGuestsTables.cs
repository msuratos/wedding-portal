using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace wedding_admin_cms.Persistance.Migrations
{
    public partial class AddGuestsTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entourages_Weddings_WeddingId",
                table: "Entourages");

            migrationBuilder.DropIndex(
                name: "IX_Entourages_WeddingId",
                table: "Entourages");

            migrationBuilder.DropColumn(
                name: "WeddingId",
                table: "Entourages");

            migrationBuilder.CreateTable(
                name: "GuestGroups",
                columns: table => new
                {
                    GuestGroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Type = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestGroups", x => x.GuestGroupId);
                });

            migrationBuilder.CreateTable(
                name: "Guests",
                columns: table => new
                {
                    GuestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    HasRsvpd = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RsvpDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GuestGroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    WeddingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Guests", x => x.GuestId);
                    table.ForeignKey(
                        name: "FK_Guests_GuestGroups_GuestGroupId",
                        column: x => x.GuestGroupId,
                        principalTable: "GuestGroups",
                        principalColumn: "GuestGroupId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Guests_Weddings_WeddingId",
                        column: x => x.WeddingId,
                        principalTable: "Weddings",
                        principalColumn: "WeddingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Guests_GuestGroupId",
                table: "Guests",
                column: "GuestGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Guests_WeddingId",
                table: "Guests",
                column: "WeddingId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Guests");

            migrationBuilder.DropTable(
                name: "GuestGroups");

            migrationBuilder.AddColumn<Guid>(
                name: "WeddingId",
                table: "Entourages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Entourages_WeddingId",
                table: "Entourages",
                column: "WeddingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entourages_Weddings_WeddingId",
                table: "Entourages",
                column: "WeddingId",
                principalTable: "Weddings",
                principalColumn: "WeddingId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
