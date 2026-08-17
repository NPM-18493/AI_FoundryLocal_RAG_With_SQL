using DTOs;
using EFCoreDatabaseLayer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlTypes;
using ServiceLayer.Document_Chunk;
using ServiceLayer.Embedding;
using ServiceLayer.Utilities;

namespace RAGWithEFCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentChunksController : ControllerBase
    {
        private readonly ICustomEmbeddingService _embeddingService;
        private readonly IDocumentChunkService _documentChunkService;

        public DocumentChunksController(IDocumentChunkService documentChunkService, ICustomEmbeddingService embeddingService)
        {
            _documentChunkService = documentChunkService;
            _embeddingService = embeddingService;
        }

        [HttpGet(Name = "GetDocumentChunks")]
        public IEnumerable<DocumentChunkDTO> Get(string query)
        {
            SqlVector<float>? queryEmbedding = string.IsNullOrEmpty(query) ? null : VectorToFloatConverter.VectorToFloat(_embeddingService.GenerateEmbeddingAsync(query).Result);
            return _documentChunkService.GetDocumentChunks(queryEmbedding);
        }

        [HttpPost(Name = "AddDocumentChunk")]
        public IActionResult Post([FromBody] DocumentChunkDTO documentChunk)
        {
            ReadOnlyMemory<double> chunkEmbedding = _embeddingService.GenerateEmbeddingAsync(documentChunk.ChunkText).Result;
            _documentChunkService.AddDocumentChunk(new DocumentChunkDTO(
                Id: null,
                ChunkText: documentChunk.ChunkText,
                CreatedAt: DateTimeOffset.UtcNow,
                ChunkEmbeddings: new List<ChunkEmbeddingDTO>
                {
                    new ChunkEmbeddingDTO(
                        Id: null,
                        DocumentId: null,
                        Embedding: VectorToFloatConverter.VectorToFloat(chunkEmbedding),
                        Document: null!
                    )
                }
            ));
            return CreatedAtRoute("GetDocumentChunks", new { id = documentChunk.Id }, documentChunk);
        }
    }
}
