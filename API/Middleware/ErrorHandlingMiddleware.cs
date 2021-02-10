using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Rest;
using System.Net;
using System.Security.Authentication;
using Newtonsoft.Json;
using Application.CustomException;

namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            this._logger = logger;
            this._next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, _logger);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex, ILogger<ErrorHandlingMiddleware> logger)
        {
            // object errors = null;
            // var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
            // Add lines to your log file, or your 
            // Application insights instance here
            // ...

            //
            object errors = null;
            switch (ex)
            {
                case AppException appEx:
                    logger.LogError(ex, "Application Error");
                    errors = appEx.Message;
                    context.Response.StatusCode = (int)appEx.GetStausCode();
                    break;
                case Exception e:
                    logger.LogError(ex, "Server Error");
                    errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            context.Response.ContentType = "application/json";
            if (errors != null)
            {
                var result = JsonConvert.SerializeObject(new { errors });
                await context.Response.WriteAsync(result);
            }

            //
            // logger.LogError(ex, "Exception Error");
            // context.Response.StatusCode = (int)GetErrorCode(contextFeature.Error);
            // context.Response.ContentType = "application/json";
            // // errors = contextFeature.Error.Message; 

            // await context.Response.WriteAsync(JsonConvert.SerializeObject(new 
            // {
            //     Status = context.Response.StatusCode,
            //     Errors = contextFeature.Error.Message
            // }));

        }

        private static HttpStatusCode GetErrorCode(Exception e)
        {
            switch (e)
            {
                case ValidationException _:
                    return HttpStatusCode.BadRequest;
                case FormatException _:
                    return HttpStatusCode.BadRequest;
                case AuthenticationException _:
                    return HttpStatusCode.Forbidden;
                case NotImplementedException _:
                    return HttpStatusCode.NotImplemented;
                default: // for Exception
                    return HttpStatusCode.InternalServerError;
            }
        }
    }
}