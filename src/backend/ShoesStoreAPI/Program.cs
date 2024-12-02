using System.Reflection;
using Bogus;
using Microsoft.AspNetCore.Http.HttpResults;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseCors();
app.UseHttpsRedirection();

var faker = new Faker<Product>()
        .UseSeed(45)
        .RuleFor(o => o.Id, f => Guid.NewGuid().ToString())
        .RuleFor(o => o.DateStock, f => f.Date.Future())
        .RuleFor(o => o.Weight, f => f.Random.Int(10, 700))
        .RuleFor(o => o.Brand, f => f.Random.Int(0, 9))
        .RuleFor(o => o.Type, f => f.Random.Int(0, 3))
        .RuleFor(o => o.Price, f => f.Random.Float(0, 1000))
        .RuleFor(o => o.Description, f => f.Lorem.Paragraph(1))
        .RuleFor(o => o.Name, f => f.Random.Words(new Random().Next(1, 5)));

var _list = new List<Product>();

_list = faker.Generate(30);

app.MapGet("/api/product", ([AsParameters] PageRequest request) =>
{
    var list = _list.OrderBy(x => x.Id).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToList();

    var response = new Respones(list, request.Page, _list.Count/request.PageSize);

    return Results.Ok(response);
})
.WithName("GetProducts")
.WithOpenApi();


app.MapGet("/api/product/{id}", (string id) =>
{
    var item = _list.Find(item => item.Id == id);
    return (item != null) ? Results.Ok(item) : Results.NotFound();
})
.WithName("GetProductById")
.WithOpenApi();


app.MapPost("/api/product", (Product model) =>
{
    try
    {
        if (model.Id == "")
        {
            throw new Exception("Invalid Id");
        }
        model.Id = Guid.NewGuid().ToString();
        //return Results.Created($"/product/{model.Id}", model);
        return Results.Ok(model);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
})
.WithName("CreateProduct")
.WithOpenApi();

app.MapPut("/api/product", (Product model) =>
{
    try
    {
        if (model.Id == "1")
        {
            throw new Exception("Invalid Id");
        }
        model.Description += "abc";
        return Results.Ok(model);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e.Message);
    }
})
.WithName("UpdateProduct")
.WithOpenApi();

app.Run();



public record Product
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime DateStock { get; set; }
    public int Weight { get; set; }
    public float Price { get; set; }
    public int? Brand { get; set; }
    public int? Type { get; set; }
    public bool Visible { get; set; }
}

public class Respones
{
    public List<Product> List { get; set; }
    public int TotalPage { get; set; }
    public int CurrentPage { get; set; }

    public Respones()
    {
        this.List = new List<Product>();
        this.TotalPage = 0;
        this.CurrentPage = 0;
    }

    public Respones(List<Product> list, int totalPage, int currentPage)
    {
        this.List = list;

        this.TotalPage = totalPage;
        this.CurrentPage = currentPage;
    }
}

public class PageRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Filter { get; set; } = "asc";
}
