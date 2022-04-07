using Microsoft.EntityFrameworkCore.Migrations;

namespace wedding_admin_cms.Persistance.Migrations
{
    public partial class PinFieldChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pin",
                table: "Weddings");

            migrationBuilder.AddColumn<string>(
                name: "Passphrase",
                table: "Weddings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "1234");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Passphrase",
                table: "Weddings");

            migrationBuilder.AddColumn<string>(
                name: "Pin",
                table: "Weddings",
                type: "nvarchar(6)",
                maxLength: 6,
                nullable: false,
                defaultValue: "1234");
        }
    }
}
