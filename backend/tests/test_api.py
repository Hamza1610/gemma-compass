import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).resolve().parent))
sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

def test_full_api():
    print("Testing Phase 5 FastAPI Endpoints...")
    
    # 1. Test Root
    res_root = client.get("/")
    print(f"GET / : status={res_root.status_code}, data={res_root.json()}")
    assert res_root.status_code == 200

    # 2. Test Create Session
    res_session = client.post("/api/sessions", json={"language_pref": "mixed"})
    session_data = res_session.json()
    print(f"POST /api/sessions : status={res_session.status_code}, id={session_data.get('id')}")
    assert res_session.status_code == 200
    session_id = session_data["id"]

    # 3. Test Document Upload (using text file since it's easy to mock)
    mock_file_content = "Newton's First Law states that objects stay at rest unless acted on. Newton's Second Law says force equals mass times acceleration (F=ma)."
    
    # UploadFile requires tuple of (filename, file_bytes_or_stream, mime_type)
    files = {"file": ("newton.txt", mock_file_content.encode("utf-8"), "text/plain")}
    data = {"session_id": session_id}
    
    res_upload = client.post("/api/documents/upload", data=data, files=files)
    upload_data = res_upload.json()
    print(f"POST /api/documents/upload : status={res_upload.status_code}")
    print(f"  doc_id: {upload_data.get('document_id')}")
    print(f"  summary_en: {upload_data.get('summary_en')}")
    print(f"  concepts counts: {len(upload_data.get('concepts', []))}")
    assert res_upload.status_code == 200
    document_id = upload_data["document_id"]

    # 4. Test Get Document
    res_doc = client.get(f"/api/documents/{document_id}")
    print(f"GET /api/documents/{{id}} : status={res_doc.status_code}, file={res_doc.json().get('filename')}")
    assert res_doc.status_code == 200

    # 5. Test Send Chat Message
    res_chat = client.post(
        f"/api/chat/{session_id}/message",
        json={"content": "What is Newton's second law?"}
    )
    chat_data = res_chat.json()
    print(f"POST /api/chat/{{session_id}}/message : status={res_chat.status_code}")
    print(f"  Assistant reply: {chat_data.get('content')[:100]}...")
    assert res_chat.status_code == 200

    # 6. Test Chat History
    res_hist = client.get(f"/api/chat/{session_id}/history")
    print(f"GET /api/chat/{{session_id}}/history : status={res_hist.status_code}, count={len(res_hist.json())}")
    assert res_hist.status_code == 200

    # 7. Test Quiz Generation
    res_quiz = client.post(f"/api/quiz/{document_id}/generate")
    quiz_data = res_quiz.json()
    print(f"POST /api/quiz/{{document_id}}/generate : status={res_quiz.status_code}, count={len(quiz_data)}")
    assert res_quiz.status_code == 200
    
    # 8. Test Submit Quiz Answer
    if quiz_data:
        question_id = quiz_data[0]["id"]
        res_ans = client.post(
            f"/api/quiz/{session_id}/answer",
            json={
                "question_id": question_id,
                "selected_answer": "Force equals mass times acceleration."
            }
        )
        print(f"POST /api/quiz/{{session_id}}/answer : status={res_ans.status_code}, correct={res_ans.json().get('is_correct')}")
        assert res_ans.status_code == 200

    # 9. Test Roadmap
    res_road = client.get(f"/api/roadmap/{session_id}")
    print(f"GET /api/roadmap/{{session_id}} : status={res_road.status_code}, gaps count={len(res_road.json())}")
    assert res_road.status_code == 200

    print("Phase 5 API testing complete and verified!")

if __name__ == "__main__":
    test_full_api()
