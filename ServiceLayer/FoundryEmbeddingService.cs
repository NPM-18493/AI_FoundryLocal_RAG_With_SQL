using Microsoft.AI.Foundry.Local;

namespace ServiceLayer
{
    public class FoundryEmbeddingService: ICustomEmbeddingService
    {
        private readonly IModel _embeddingModel;

        public FoundryEmbeddingService(IModel embeddingModel)
        {
            _embeddingModel = embeddingModel ?? throw new ArgumentNullException(nameof(embeddingModel));
        }

        public async Task<ReadOnlyMemory<double>> GenerateEmbeddingAsync(string text, CancellationToken cancellationToken = default)
        {
            // Get client dynamically from the loaded model
            var client = await _embeddingModel.GetEmbeddingClientAsync();
            var response = await client.GenerateEmbeddingAsync(text);
            return response.Data[0].Embedding.ToArray();
        }

        public async Task<IReadOnlyList<ReadOnlyMemory<double>>> GenerateEmbeddingsAsync(IEnumerable<string> texts, CancellationToken cancellationToken = default)
        {
            var client = await _embeddingModel.GetEmbeddingClientAsync();
            var response = await client.GenerateEmbeddingsAsync(texts.ToList());
            return response.Data.Select(d => (ReadOnlyMemory<double>)d.Embedding.ToArray()).ToList();
        }
    }
}
