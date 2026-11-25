package Bookmyshow2.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Which AI provider to call. Groq (free tier, OpenAI-compatible API) is used
 * when GROQ_API_KEY is set; otherwise OpenAI with OPENAI_API_KEY, as before.
 * Keys come from environment variables (Render → Environment), never from git.
 */
@Component
public class AiProvider {

    private static final String GROQ_BASE   = "https://api.groq.com/openai/v1";
    private static final String OPENAI_BASE = "https://api.openai.com/v1";

    @Value("${groq.api.key:}")
    private String groqKey;

    @Value("${openai.api.key:}")
    private String openaiKey;

    private boolean useGroq() {
        return groqKey != null && !groqKey.isBlank();
    }

    public boolean isConfigured() {
        return useGroq() || (openaiKey != null && !openaiKey.isBlank());
    }

    public String apiKey() {
        return useGroq() ? groqKey : openaiKey;
    }

    public String chatUrl() {
        return (useGroq() ? GROQ_BASE : OPENAI_BASE) + "/chat/completions";
    }

    public String transcribeUrl() {
        return (useGroq() ? GROQ_BASE : OPENAI_BASE) + "/audio/transcriptions";
    }

    public String chatModel() {
        return useGroq() ? "openai/gpt-oss-120b" : "gpt-4o-mini";
    }

    public String transcribeModel() {
        return useGroq() ? "whisper-large-v3-turbo" : "whisper-1";
    }

    /** Sets the model, plus low reasoning effort for gpt-oss so short max_tokens still leave room for the answer. */
    public void applyModel(Map<String, Object> body) {
        body.put("model", chatModel());
        if (chatModel().startsWith("openai/gpt-oss")) {
            body.put("reasoning_effort", "low");
        }
    }
}
