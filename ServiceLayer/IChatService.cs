using EFCoreDatabaseLayer.Models;

namespace ServiceLayer
{
    public interface IChatService
    {
    Task<string> CompleteChatAsync(string prompt, IEnumerable<DocumentChunk> relevantChunks, CancellationToken cancellationToken = default);
    }
}
