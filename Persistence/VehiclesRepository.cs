using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Core;
using vega.Core.Models;
using vega.Extensions;

namespace vega.Persistence
{
    public class VehiclesRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;

        private readonly Dictionary<string, Expression<Func<Vehicle, object>>> vehicleFieldExpressionMap;

        public VehiclesRepository(VegaDbContext context)
        {
            this.context = context;
            
            this.vehicleFieldExpressionMap = new Dictionary<string, Expression<Func<Vehicle, object>>>() {
                ["make"] = v => v.Model.Make.Name,
                ["model"] = v => v.Model.Name,
                ["contactName"] = v => v.ContactName
            };
        }

        public void Add(Vehicle vehicle)
        {
            this.context.Add(vehicle);
        }

        public async Task<QueryResult<Vehicle>> GetAllAsync(VehicleQuery query = null)
        {
            var result = new QueryResult<Vehicle>();

            var queryable = this.context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .AsQueryable();

            // apply query attributes
            if(query != null)
            {
                if(query.MakeId.HasValue)
                    queryable = queryable.Where(v => v.Model.MakeId == query.MakeId.Value);
                
                if(query.ModelId.HasValue)
                    queryable = queryable.Where(v => v.Model.Id == query.ModelId.Value);
                
                // get total item count *before* applying paging options
                result.TotalItems = await queryable.CountAsync();

                queryable = queryable
                    .ApplyOrdering(query, this.vehicleFieldExpressionMap)
                    .ApplyPaging(query);
            }
            else
            {
                result.TotalItems = await queryable.CountAsync();
            }

            result.Items = await queryable.ToArrayAsync();

            return result;
        }

        public async Task<Vehicle> GetAsync(int id, bool includeRelated = true)
        {
            if(!includeRelated)
                return await this.context.Vehicles.FindAsync(id);

            return await this.context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Remove(Vehicle vehicle)
        {
            this.context.Remove(vehicle);
        }
    }
}