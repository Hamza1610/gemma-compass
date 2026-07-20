from typing import List

def chunk_text(text: str, chunk_size_words: int = 500, overlap_words: int = 50) -> List[str]:
    """
    Split text into chunks of approximately chunk_size_words.
    overlap_words is the number of words shared between consecutive chunks.
    """
    if not text.strip():
        return []

    words = text.split()
    if len(words) <= chunk_size_words:
        return [text]

    chunks = []
    i = 0
    while i < len(words):
        chunk_slice = words[i:i + chunk_size_words]
        # Avoid creating tiny trailing chunks
        if len(chunk_slice) < 50 and chunks:
            # Append remaining words to last chunk
            chunks[-1] = chunks[-1] + " " + " ".join(chunk_slice)
            break
            
        chunks.append(" ".join(chunk_slice))
        i += chunk_size_words - overlap_words

    return chunks
