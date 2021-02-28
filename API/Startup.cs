using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;
using MediatR;
using Application.Activities;
using FluentValidation.AspNetCore;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Identity;
using Infrastructure.Security;
using Application.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using AutoMapper;
using Infrastructure.Photos;
using API.SignalR;
using Application.Profiles;
// using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore.SqlServer;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(optionsAction =>
            {
                optionsAction.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddMvc(opt =>
           {
               opt.EnableEndpointRouting = false;
               // Every request handled with authorization
               var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
               opt.Filters.Add(new AuthorizeFilter(policy));
           })
           .AddFluentValidation(configurationExpression => configurationExpression.RegisterValidatorsFromAssemblyContaining<Create>());

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(optionsAction =>
            {
                optionsAction.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddMvc(opt =>
            {
                opt.EnableEndpointRouting = false;
                // Every request handled with authorization
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(configurationExpression => configurationExpression.RegisterValidatorsFromAssemblyContaining<Create>());

            ConfigureServices(services);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithExposedHeaders("WWW-Authenticate").WithOrigins("http://localhost:3000").AllowCredentials();
                });
            });
            services.AddSignalR();

            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(List.Handler));
            services.AddControllers();

            var builder = services.AddIdentityCore<AppUser>(options =>
            {
                options.Password.RequiredLength = 2;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            });
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key"));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                    // ValidIssuer = "Issuer",
                    // ValidAudience = "Audience",
                    // ValidateIssuer = false,
                    // ValidateAudience = false,
                    // ValidateLifetime = true,
                    // ValidateIssuerSigningKey = true,
                    // IssuerSigningKey = key
                };
                opt.Events = new JwtBearerEvents()
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(auth =>
            {
                auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
                 .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme‌)
                  .RequireAuthenticatedUser().Build());
            });

            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IProfileReader, ProfileReader>();
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        [Obsolete]
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
            }
            else
            {
                // app.UseHsts();
            }

            // app.UseXContentTypeOptions();
            // app.UseReferrerPolicy(opt => opt.NoReferrer());
            // app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            // app.UseXfo(opt => opt.Deny());
            // app.UseCsp(opt =>
            // {
            //     opt.BlockAllMixedContent()
            //     .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"))
            //     .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:", "https://cdnjs.cloudflare.com"))
            //     .FormActions(s => s.Self())
            //     .FrameAncestors(s => s.Self())
            //     .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "blob:", "data:"))
            //     .ScriptSources(s => s.Self().CustomSources("sha256-gr2oEYjfQ0UMjr7F3vj+ve1vp/88w6M3GF5AXB99Uqo="));
            // });

            // app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseCors("CorsPolicy");
            app.UseRouting();
            app.UseAuthorization();
            app.UseAuthentication();
            app.UseSignalR(routes => { routes.MapHub<ChatHub>("/chat"); });
            // app.UseEndpoints(endpoints =>
            // {
            //     endpoints.MapControllers();
            // });

            app.UseMvc(rootes =>
            {
                rootes.MapSpaFallbackRoute(name: "spa-fallback", defaults: new { controller = "Fallback", action = "Index" });
            });
        }
    }
}
