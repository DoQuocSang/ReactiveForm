using Bogus;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseHttpsRedirection();

var faker = new Faker<Product>()
        .UseSeed(45)
        .RuleFor(o => o.Id, f => (f.UniqueIndex + 1).ToString())
        .RuleFor(o => o.DateStock, f => f.Date.Future())
        .RuleFor(o => o.Weight, f => f.Random.Int(10, 700))
        .RuleFor(o => o.Brand, f => f.Random.Int(0, 3))
        .RuleFor(o => o.Type, f => f.Random.Int(0, 9))
        .RuleFor(o => o.Description, f => f.Lorem.Paragraph(1))
    ;

app.MapGet("/product", () =>
{
    //Task.Delay(5000)
    Thread.Sleep(5000);
    var list = faker.Generate(10);
    return list;
})
.WithName("GetProduct")
.WithOpenApi();


app.MapPost("/product/{id}", ([AsParameters] PageRequest request) =>
{
    return request;
})
.WithName("GetPageProduct")
.WithOpenApi();

app.MapPost("/product", (Product model) =>
{
    try
    {
        if (model.Id == "")
        {
            throw new Exception("Invalid Id");
        }
        model.Description += "abc";
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

app.MapPut("/product", (Product model) =>
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

internal record Product
{
    public string Id { get; set; }
    public string Description { get; set; }
    public DateTime DateStock { get; set; }
    public int Weight { get; set; }
    public int? Brand { get; set; }
    public int? Type { get; set; }
    public bool Visible { get; set; }
}


public class PageRequest
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public string Filter { get; set; }
}
