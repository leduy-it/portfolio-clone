export const CANNED_RESPONSES_BY_LOCALE = {
  en: {
    "Hey! Who are you?":
      "[Duy's agent]\n\nDuy Le — AI Engineer in Ho Chi Minh City. He works across OCR, Document AI, and LLM agents. This site is the version of him without the LinkedIn polish: technical work and the human side in the same frame.",
    "Tell me about your work experience":
      "[Duy's agent]\n\nDuy ships AI for two places in parallel: GMO-Z.com RUNSYSTEM, where he runs multilingual OCR + Document AI pipelines for banks across VN/JP, and GrowtricsAI, an edtech startup where he's the early-stage engineer building agentic crawl + observability backbone. Earlier: SmartPay JSC for real-time fraud detection. Hit the Send to Duy button if you want the long version directly from him.",
    "Show me your cinema wall":
      "[Duy's agent]\n\nThe Cinema page is films Duy keeps returning to — Dune, Oppenheimer, Interstellar, Blade Runner 2049, Arrival, Project Hail Mary, Peaky Blinders, All Quiet on the Western Front. Less review log, more recurring weather system.",
    "Let's schedule a chat":
      "[Duy's agent]\n\nHappy to set that up. Hit Send to Duy below — write a couple of lines about what you'd like to talk through (role, project, problem, just-curious) and Duy will reply from levduyit@gmail.com within a day or two.",
    "Any food recs in Saigon?":
      "[Duy's agent]\n\nBún bò at Gánh, cơm tấm at Ba Ghiền, then cà phê sữa đá at The Workshop. That's a fairly honest Saigon evening. Bonus: bánh mì 37 Nguyễn Trãi if it's late and you skipped lunch.",
    "What's your AI stack?":
      "[Duy's agent]\n\nDay-to-day: PyTorch, Triton Inference Server, TensorRT/ONNX for serving; FastAPI + PostgreSQL + S3 for the document-parsing layer; LangGraph + LlamaIndex for agentic workflows; Weaviate for retrieval. Build harness while writing all of it: Claude, Codex, GLM Code.",
    "Hardest thing you've shipped?":
      "[Duy's agent]\n\nProduction OCR for banks. The model isn't the hard part — it's the long tail. Fluorescent-light phone scans, photocopied IDs with bruised shadows, fonts the dataset never saw, and the customer call where someone counts the seconds out loud. Lifted accuracy 94→98%, latency down ~40%, and learned more about humility than about transformers.",
  },
  vi: {
    "Chào! Bạn là ai?":
      "[trợ lí của Duy]\n\nDuy Le — AI Engineer ở TPHCM. Làm việc với OCR, Document AI, và LLM agent. Trang này là phiên bản của Duy không có lớp đánh bóng LinkedIn: công việc kỹ thuật và phần con người chung một khung hình.",
    "Kể tôi nghe về kinh nghiệm làm việc của Duy":
      "[trợ lí của Duy]\n\nDuy ship AI ở hai chỗ song song: GMO-Z.com RUNSYSTEM — chạy pipeline OCR đa ngôn ngữ + Document AI cho ngân hàng VN/JP. Và GrowtricsAI — một startup edtech, Duy là engineer giai đoạn đầu xây agentic crawl + observability backbone. Trước đó là SmartPay JSC, fraud detection real-time. Bấm Send to Duy nếu muốn nghe bản dài trực tiếp từ Duy.",
    "Cho tôi xem wall phim của Duy":
      "[trợ lí của Duy]\n\nTrang Cinema là những bộ phim Duy cứ quay lại — Dune, Oppenheimer, Interstellar, Blade Runner 2049, Arrival, Project Hail Mary, Peaky Blinders, Phía Tây không có gì lạ. Ít giống nhật ký review, giống một hệ thống thời tiết lặp đi lặp lại.",
    "Hẹn gặp Duy được không?":
      "[trợ lí của Duy]\n\nSẵn sàng. Bấm Send to Duy bên dưới — viết vài dòng bạn muốn trao đổi gì (role, dự án, vấn đề, chỉ tò mò) — Duy sẽ trả lời từ levduyit@gmail.com trong một hai ngày.",
    "Gợi ý quán ăn ở Sài Gòn?":
      "[trợ lí của Duy]\n\nBún bò ở Gánh, cơm tấm ở Ba Ghiền, rồi cà phê sữa đá ở The Workshop. Một buổi tối Sài Gòn khá thành thật. Bonus: bánh mì 37 Nguyễn Trãi nếu khuya và bạn nhỡ bữa.",
    "Stack AI của Duy là gì?":
      "[trợ lí của Duy]\n\nHàng ngày: PyTorch, Triton Inference Server, TensorRT/ONNX cho serving; FastAPI + PostgreSQL + S3 cho lớp document-parsing; LangGraph + LlamaIndex cho workflow agentic; Weaviate cho retrieval. Bộ build harness trong lúc viết tất cả: Claude, Codex, GLM Code.",
    "Điều khó nhất Duy từng ship?":
      "[trợ lí của Duy]\n\nOCR production cho ngân hàng. Model không phải phần khó — long tail mới khó. Ảnh chụp điện thoại dưới đèn huỳnh quang, CMND photocopy với bóng tối bầm, font dataset chưa từng thấy, và cú điện thoại khách hàng đếm giây ra tiếng. Nâng accuracy 94→98%, latency giảm ~40%, và học được nhiều về sự khiêm tốn hơn là về transformer.",
  },
} as const

export const SUGGESTIONS_BY_LOCALE = {
  en: Object.keys(CANNED_RESPONSES_BY_LOCALE.en),
  vi: Object.keys(CANNED_RESPONSES_BY_LOCALE.vi),
}

// Backwards-compat re-exports
export const CANNED_RESPONSES = CANNED_RESPONSES_BY_LOCALE.en
export const SUGGESTIONS = SUGGESTIONS_BY_LOCALE.en
