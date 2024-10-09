using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotDeskWebApp.Migrations
{
    /// <inheritdoc />
    public partial class Mg2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "Desks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "Desks",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
