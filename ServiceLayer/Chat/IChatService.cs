using EFCoreDatabaseLayer.Models;

namespace ServiceLayer.Chat
{
    public interface IChatService
    {
    Task<string> CompleteChatAsync(string prompt, IEnumerable<DocumentChunk> relevantChunks, CancellationToken cancellationToken = default);
    }
}
