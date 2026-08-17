using EFCoreDatabaseLayer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlTypes;
using ServiceLayer.Chat;
using ServiceLayer.Document_Chunk;
using ServiceLayer.Embedding;
using ServiceLayer.Utilities;

namespace RAGWithEFCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IDocumentChunkService _documentChunkService;
        private readonly ICustomEmbeddingService _embeddingService;

        public ChatController(IChatService chatService, IDocumentChunkService documentChunkService, ICustomEmbeddingService embeddingService)
        {
            _chatService = chatService;
            _documentChunkService = documentChunkService;
            _embeddingService = embeddingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetChatResponse([FromQuery] string prompt)
        {
            IEnumerable<DocumentChunk> relevantChunks = GetReleventDocumentChunks(prompt);
            var response = await _chatService.CompleteChatAsync(prompt, relevantChunks);
            return Ok(response);
        }

        private List<DocumentChunk> GetReleventDocumentChunks(string query)
        {
            SqlVector<float>? queryEmbedding = string.IsNullOrEmpty(query) ? null : VectorToFloatConverter.VectorToFloat(_embeddingService.GenerateEmbeddingAsync(query).Result);
            return _documentChunkService.GetDocumentChunks(queryEmbedding, 3);
        }
    }
}
