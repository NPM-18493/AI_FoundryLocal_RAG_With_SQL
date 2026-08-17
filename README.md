# Foundry Local + SQL Server 2025 + EF Core

## Foundry Local

Details related to downloading Foundry Local can be found at https://github.com/microsoft/Foundry-Local/releases. Once it is installed, use command `foundry model list` to check all available models for download. In this example, we are using 2 models. One for embedding chunks into vectors and another one for chat response.

Below commands are used for downloading models:

'foundry model load "qwen3-embedding-0.6b-generic-cpu:1"'
'foundry model load "qwen2.5-coder-0.5b-instruct-generic-cpu:4"'

## SQL Server 2025

SQL Server 2025 supports vector columns. Below script can be used to create SQL tables which are used in this example. For security purpose, I have saved my connection string in Secrets.json.

`SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DocumentChunks](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[ChunkText] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetimeoffset](7) NOT NULL,
 CONSTRAINT [PK_DocumentChunks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[DocumentChunks] ADD  CONSTRAINT [DF_DocumentChunks_CreatedAt]  DEFAULT (sysdatetimeoffset()) FOR [CreatedAt]
GO`

`CREATE TABLE dbo.ChunkEmbeddings (
    Id BIGINT IDENTITY(1,1) NOT NULL,
    DocumentId BIGINT NOT NULL,
    Embedding VECTOR(1024) NOT NULL,
    CONSTRAINT PK_ChunkEmbeddings PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_ChunkEmbeddings_DocumentChunks FOREIGN KEY (DocumentId) 
        REFERENCES dbo.DocumentChunks (Id) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX IX_ChunkEmbeddings_DocumentId 
    ON dbo.ChunkEmbeddings (DocumentId);
GO`

## EF Core

Entity framework Core 10 has come up with features related to semantic search. We have leverage them in this example. Nuget package references are part of the csproj files so no additional download required.

I have used database first model in this example.
