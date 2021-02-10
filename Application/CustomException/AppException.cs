using System;
using System.Net;

namespace Application.CustomException
{
    public class AppException : Exception
    {
        private readonly HttpStatusCode _statusCode;

        public AppException(string errorMessage, HttpStatusCode statusCode)
            : base(errorMessage)
        {
            this._statusCode = statusCode;
        }

        public HttpStatusCode GetStausCode()
        {
            return this._statusCode;
        }
    }
}