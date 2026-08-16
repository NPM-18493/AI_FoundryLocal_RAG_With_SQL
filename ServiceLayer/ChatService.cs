using Microsoft.AI.Foundry.Local;
using Betalgo.Ranul.OpenAI.ObjectModels.RequestModels;

namespace ServiceLayer
{
    public class ChatService : IChatService
    {
        public readonly IModel _model;
        public ChatService(IModel model)
        {
            _model = model;
        }
        public async Task<string> CompleteChatAsync(string prompt, CancellationToken cancellationToken = default)
        {
            var client = await _model.GetChatClientAsync();
            var messages = new List<ChatMessage>
        {
            new ChatMessage { Role = "system", Content = "You are a helpful assistant." },
            new ChatMessage { Role = "user", Content = prompt }
        };

            var response = await client.CompleteChatAsync(messages);
            return response.Choices?[0]?.Message?.Content ?? string.Empty;
        }
    }
}
