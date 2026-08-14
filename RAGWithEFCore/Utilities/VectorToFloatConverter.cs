using Microsoft.Data.SqlTypes;

namespace RAGWithEFCore.Utilities
{
    public static class VectorToFloatConverter
    {
        public static SqlVector<float> VectorToFloat(ReadOnlyMemory<double> input) {

            ReadOnlySpan<double> doubleSpan = input.Span;
            // Allocate float array from memory pool or stack span
            float[] floatBuffer = new float[doubleSpan.Length];

            for (int i = 0; i < doubleSpan.Length; i++)
            {
                floatBuffer[i] = (float)doubleSpan[i];
            }

            SqlVector<float> sqlVector = new SqlVector<float>(floatBuffer);
            return sqlVector;
        }
    }
}
