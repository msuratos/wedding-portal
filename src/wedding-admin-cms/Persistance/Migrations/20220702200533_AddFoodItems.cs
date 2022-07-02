using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace wedding_admin_cms.Persistance.Migrations
{
  public partial class AddFoodItems : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "FoodTypes",
          columns: table => new
          {
            FoodTypeId = table.Column<int>(type: "int", nullable: false)
                  .Annotation("SqlServer:Identity", "1, 1"),
            Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_FoodTypes", x => x.FoodTypeId);
          });

      migrationBuilder.CreateTable(
          name: "FoodItems",
          columns: table => new
          {
            FoodId = table.Column<int>(type: "int", nullable: false)
                  .Annotation("SqlServer:Identity", "1, 1"),
            WeddingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            FoodTypeId = table.Column<int>(type: "int", nullable: false),
            Food = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
            Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_FoodItems", x => x.FoodId);
            table.ForeignKey(
                      name: "FK_FoodItems_FoodTypes_FoodTypeId",
                      column: x => x.FoodTypeId,
                      principalTable: "FoodTypes",
                      principalColumn: "FoodTypeId",
                      onDelete: ReferentialAction.Cascade);
            table.ForeignKey(
                      name: "FK_FoodItems_Weddings_WeddingId",
                      column: x => x.WeddingId,
                      principalTable: "Weddings",
                      principalColumn: "WeddingId",
                      onDelete: ReferentialAction.Cascade);
          });

      migrationBuilder.CreateIndex(
          name: "IX_FoodItems_FoodTypeId",
          table: "FoodItems",
          column: "FoodTypeId");

      migrationBuilder.CreateIndex(
          name: "IX_FoodItems_WeddingId",
          table: "FoodItems",
          column: "WeddingId");

      // seed the food type table
      migrationBuilder.InsertData("FoodTypes", "Type", "Appetizer");
      migrationBuilder.InsertData("FoodTypes", "Type", "Entree");
      migrationBuilder.InsertData("FoodTypes", "Type", "Dessert");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "FoodItems");

      migrationBuilder.DropTable(
          name: "FoodTypes");
    }
  }
}
