using Betalgo.Ranul.OpenAI.Interfaces;
using Betalgo.Ranul.OpenAI.ObjectModels.RequestModels;
using DTOs;
using EFCoreDatabaseLayer.Models;
using Microsoft.AI.Foundry.Local;
using Microsoft.Data.SqlTypes;
using ServiceLayer.Utilities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ServiceLayer.Chat
{
    public class ChatService : IChatService
    {
        public readonly IModel _model;

        public ChatService(IModel model)
        {
            _model = model;
        }
        public async Task<string> CompleteChatAsync(string prompt, IEnumerable<DocumentChunkDTO> relevantChunks, CancellationToken cancellationToken = default)
        {
            var client = await _model.GetChatClientAsync();
            var messages = new List<ChatMessage> {
            new ChatMessage { Role = "system", Content = "You are a helpful assistant." },
            new ChatMessage { Role = "user", Content = prompt }
            };

            if (relevantChunks.Any())
            {
                messages.Add(new ChatMessage {
                    Role = "user",
                    Content = $"Here are some relevant document chunks:\n{string.Join("\n", relevantChunks.Select(c => c.ChunkText))}"
                });
            }

            var response = await client.CompleteChatAsync(messages, cancellationToken);
            return response.Choices?[0]?.Message?.Content ?? string.Empty;
        }
    }
}
