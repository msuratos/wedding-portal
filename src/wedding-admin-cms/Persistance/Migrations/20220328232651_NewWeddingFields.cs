using Microsoft.EntityFrameworkCore.Migrations;

namespace wedding_admin_cms.Persistance.Migrations
{
    public partial class NewWeddingFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PictureUrl",
                table: "Weddings",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "https://c1.staticflickr.com/1/71/226654184_26b52a6116_z.jpg?zz=1");

            migrationBuilder.AddColumn<string>(
                name: "Pin",
                table: "Weddings",
                type: "nvarchar(6)",
                maxLength: 6,
                nullable: false,
                defaultValue: "1234");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Weddings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Wedding");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PictureUrl",
                table: "Weddings");

            migrationBuilder.DropColumn(
                name: "Pin",
                table: "Weddings");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Weddings");
        }
    }
}
