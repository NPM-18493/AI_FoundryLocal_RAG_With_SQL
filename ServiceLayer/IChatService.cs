using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceLayer
{
    public interface IChatService
    {
    Task<string> CompleteChatAsync(string prompt, CancellationToken cancellationToken = default);
    }
}
