using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        // GET get
        // [HttpGet]
        // public ActionResult<IEnumerable<string>> Get()
        // {
        //     // var rng = new Random();
        //     // return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //     // {
        //     //     Date = DateTime.Now.AddDays(index),
        //     //     TemperatureC = rng.Next(-20, 55),
        //     //     Summary = Summaries[rng.Next(Summaries.Length)]
        //     // })
        //     // .ToArray();
        //     return new string[] { "w", "sdds" };
        // }

        [HttpGet]
        [Route("[action]")]
        public ActionResult<IEnumerable<string>> GetValues()
        {
            // var rng = new Random();
            // return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            // {
            //     Date = DateTime.Now.AddDays(index),
            //     TemperatureC = rng.Next(-20, 55),
            //     Summary = Summaries[rng.Next(Summaries.Length)]
            // })
            // .ToArray();
            return Ok(new string[] { "w", "sdds" });
        }
    }
}
