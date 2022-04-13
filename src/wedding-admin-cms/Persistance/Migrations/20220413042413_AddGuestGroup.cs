using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace wedding_admin_cms.Persistance.Migrations
{
    public partial class AddGuestGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GuestGroupId",
                table: "Guest",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GuestGroup",
                columns: table => new
                {
                    GuestGroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Type = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestGroup", x => x.GuestGroupId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Guest_GuestGroupId",
                table: "Guest",
                column: "GuestGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Guest_GuestGroup_GuestGroupId",
                table: "Guest",
                column: "GuestGroupId",
                principalTable: "GuestGroup",
                principalColumn: "GuestGroupId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Guest_GuestGroup_GuestGroupId",
                table: "Guest");

            migrationBuilder.DropTable(
                name: "GuestGroup");

            migrationBuilder.DropIndex(
                name: "IX_Guest_GuestGroupId",
                table: "Guest");

            migrationBuilder.DropColumn(
                name: "GuestGroupId",
                table: "Guest");
        }
    }
}
