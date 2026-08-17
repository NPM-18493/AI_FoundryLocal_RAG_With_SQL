using DTOs;

namespace ServiceLayer.Chat
{
    public interface IChatService
    {
    Task<string> CompleteChatAsync(string prompt, IEnumerable<DocumentChunkDTO> relevantChunks, CancellationToken cancellationToken = default);
    }
}
