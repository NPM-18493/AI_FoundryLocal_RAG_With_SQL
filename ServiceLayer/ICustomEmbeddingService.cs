namespace ServiceLayer
{
    public interface ICustomEmbeddingService
    {
        Task<ReadOnlyMemory<double>> GenerateEmbeddingAsync(string text, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<ReadOnlyMemory<double>>> GenerateEmbeddingsAsync(IEnumerable<string> texts, CancellationToken cancellationToken = default);
    }
}
