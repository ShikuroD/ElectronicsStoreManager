using System;
using AppCore.Interfaces;
using AppCore.Services;
using Infrastructure;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MvcClient {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            services.AddControllersWithViews ();
            services.AddDbContext<ElectronicsStoreContext> ();
            // services.AddDbContext<ElectronicsStoreContext>(options => options
            //     .UseLazyLoadingProxies()
            //     .UseSqlite($"Data Source=..\\Infrastructure\\electronics.db"));

            services.AddMvc ();
            services.AddDistributedMemoryCache ();

            services.AddSession (options => {
                // Set a short timeout for easy testing.
                options.IdleTimeout = TimeSpan.FromMinutes (60);
                // You might want to only set the application cookies over a secure connection:
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.HttpOnly = true;
                // Make the session cookie essential
                options.Cookie.IsEssential = true;
            });
            services.AddHttpContextAccessor ();
            services.Configure<KestrelServerOptions> (options => {
                options.AllowSynchronousIO = true;
            });
            services.AddAntiforgery (o => {
                o.HeaderName = "XSRF-TOKEN";
            });

            //dependencies injection
            services.AddScoped<IItemRepos, ItemRepos> ();
            services.AddScoped<IItemRelationRepos, ItemRelationRepos> ();
            services.AddScoped<ICustomerRepos, CustomerRepos> ();
            services.AddScoped<IOrderRepos, OrderRepos> ();
            services.AddScoped<IOrderDetailRepos, OrderDetailRepos> ();
            services.AddScoped<ISubOrderDetailRepos, SubOrderDetailRepos> ();
            services.AddScoped<IImportRepos, ImportRepos> ();

            services.AddScoped<IUnitOfWork, UnitOfWork> ();

            services.AddScoped<ISearchSortService, SearchSortService> ();
            services.AddScoped<ILoginService, LoginService> ();
            services.AddScoped<IOrderService, OrderService> ();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            } else {
                app.UseExceptionHandler ("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts ();
            }
            app.UseHttpsRedirection ();
            app.UseStaticFiles ();
            app.UseSession ();
            app.UseRouting ();

            app.UseAuthorization ();

            app.UseEndpoints (endpoints => {
                endpoints.MapControllerRoute (
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}