using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        [HttpGet]
        [Route("[action]")]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
        {
            return await Mediator.Send(new List.Query(limit, offset, isGoing, isHost, startDate));
        }

        [HttpGet]
        [Route("[action]/{id}")]
        [Authorize(Policy = "Bearer")]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query() { Id = id });
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<Unit>> Create([FromBody] Create.Command command)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return await Mediator.Send(command);
        }

        [HttpPut]
        [Route("[action]/{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, [FromBody] Edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete]
        [Route("[action]/{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new Delete.Command() { Id = id });
            // return new JsonResult(new { Data = "asdasd", asdsaasd = "ASdas" });
        }

        [HttpPost]
        [Route("{id}/[action]")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command() { Id = id });
        }

        [HttpDelete]
        [Route("{id}/[action]")]
        public async Task<ActionResult<Unit>> UnAttend(Guid id)
        {
            return await Mediator.Send(new UnAttend.Command() { Id = id });
        }
    }
}