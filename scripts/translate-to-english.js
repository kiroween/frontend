/**
 * Script to translate Korean text to English in the codebase
 */

const fs = require("fs");
const path = require("path");

// Translation mappings
const translations = {
  // Common UI
  회원가입: "Sign Up",
  로그인: "Login",
  로그아웃: "Logout",
  닫기: "Close",
  취소: "Cancel",
  확인: "Confirm",
  저장: "Save",
  삭제: "Delete",
  수정: "Edit",
  공유: "Share",
  다운로드: "Download",
  복사: "Copy",
  복사됨: "Copied",
  "처리 중...": "Processing...",
  "생성 중...": "Creating...",

  // Auth
  이메일: "Email",
  비밀번호: "Password",
  "사용자 이름": "Username",
  "계정이 없으신가요?": "Don't have an account?",
  "이미 계정이 있으신가요?": "Already have an account?",

  // Landing page
  "과거를 묻고,": "Bury the past,",
  "미래를 부활하라": "Resurrect the future",
  "기억의 사후 세계에 오신 것을 환영합니다.":
    "Welcome to the afterlife of memories.",
  "당신의 과거를 봉인하고, 정해진 시간에 부활시키세요.":
    "Seal your past and resurrect it at the appointed time.",
  "기억의 사후 세계로 돌아오세요": "Return to the afterlife of memories",
  "기억의 사후 세계에 입장하세요": "Enter the afterlife of memories",
  "또는 둘러보기": "or Explore",

  // Time capsule
  타임캡슐: "Time Capsule",
  "타임캡슐을 찾을 수 없습니다": "Time capsule not found",
  "타임캡슐을 불러오는 중...": "Loading time capsule...",
  "타임캡슐을 불러오는데 실패했습니다": "Failed to load time capsule",
  "타임캡슐을 불러올 수 없습니다": "Failed to load time capsule",
  "타임캡슐 공유": "Share Time Capsule",
  "타임캡슐이 생성되었습니다.": "Time capsule created.",
  "타임캡슐이 삭제되었습니다.": "Time capsule deleted.",
  "타임캡슐이 열렸습니다!": "Time capsule opened!",

  // Errors
  "접근 권한이 없습니다": "Access denied",
  "인증이 필요합니다": "Authentication required",
  "로그인에 실패했습니다. 다시 시도해주세요.":
    "Login failed. Please try again.",
  "회원가입에 실패했습니다. 다시 시도해주세요.":
    "Sign up failed. Please try again.",
  "입력값이 올바르지 않습니다": "Invalid input",
  "공유 링크 생성에 실패했습니다": "Failed to create share link",

  // Share
  "공유 링크": "Share Link",
  "공유 ID": "Share ID",
  "소셜 미디어로 공유": "Share on Social Media",
  협력자: "Collaborators",
  "클립보드에 복사되었습니다": "Copied to clipboard",
  "카카오톡 공유는 준비 중입니다.": "KakaoTalk sharing is coming soon.",
  "TimeGrave에서 타임캡슐을 공유합니다": "Sharing time capsule from TimeGrave",
  "이 협력자를 제거하시겠습니까?": "Remove this collaborator?",

  // Misc
  "묘지 목록으로 돌아갑니다...": "Returning to graveyard...",
  "다시 묻기 로직": "Rebury logic",
  "오픈 날짜": "Open Date",
  "TimeGrave - 과거를 묻고, 미래를 부활하라":
    "TimeGrave - Bury the past, Resurrect the future",

  // Validation
  "제목은 필수 항목입니다": "Title is required",
  "잠금 해제 날짜는 미래여야 합니다": "Unlock date must be in the future",
  "파일 크기는": "File size cannot exceed",
  "MB를 초과할 수 없습니다.": "MB.",
  "허용되지 않는 파일 형식입니다.": "File type not allowed.",

  // Aria labels
  "Twitter로 공유": "Share on Twitter",
  "Facebook으로 공유": "Share on Facebook",
  "KakaoTalk으로 공유": "Share on KakaoTalk",
  "이메일로 공유": "Share via Email",

  // Test messages
  "Time Capsule을 찾을 수 없습니다": "Time capsule not found",
  "네트워크 연결을 Confirm해주세요. 인터넷 연결 상태를 Confirm하거나 잠시 후 다시 시도해주세요.":
    "Please check your network connection. Verify your internet connection or try again later.",
  네트워크: "network",
  연결: "connection",
  "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.":
    "Request timed out. Please try again later.",
  "시간이 초과": "timed out",
  "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.":
    "Server error occurred. Please try again later.",
  "데이터베이스 connection에 실패했습니다": "Database connection failed",
  "Email 형식이 올바르지 않습니다": "Invalid email format",
  "Password가 일치하지 않습니다": "Password does not match",
  "이미 존재하는 Email입니다": "Email already exists",
  "내용은 1000자를 초과할 수 없습니다": "Content cannot exceed 1000 characters",
  "서버 오류가 발생했습니다": "Server error occurred",
  권한: "permission",
  "찾을 수 없습니다": "not found",
  입력: "input",
  "서버 오류": "server error",
  "알 수 없는 오류": "unknown error",
  "Password는 최소 8자 이상이어야 합니다":
    "Password must be at least 8 characters",
  "Username은 필수 항목입니다": "Username is required",
  "Email 또는 Password가 올바르지 않습니다": "Invalid email or password",
  Logout되었습니다: "Logged out successfully",
  "계정이 Delete되었습니다": "Account deleted successfully",
  "unknown error가 발생했습니다. 잠시 후 다시 시도해주세요.":
    "An unknown error occurred. Please try again later.",
  "Login이 필요합니다. 다시 Login해주세요.":
    "Login required. Please log in again.",
  "Access denied. 이 작업을 수행할 permission이 없습니다.":
    "Access denied. You don't have permission to perform this action.",
  "요청한 리소스를 not found.": "Requested resource not found.",
  "input 정보를 Confirm해주세요. 올바른 형식으로 input했는지 Confirm해���세요.":
    "Please check your input. Make sure you entered it in the correct format.",
  "Share 링크 생성에 실패했습니다.": "Failed to create share link.",
  "클립보드에 Copy되었습니다": "Copied to clipboard",
  "소셜 미디어로 Share": "Share on Social Media",
  "Facebook으로 Share": "Share on Facebook",
  "KakaoTalk으로 Share": "Share on KakaoTalk",
  "이 Collaborators를 제거하시겠습니까?": "Remove this collaborator?",
  소유자: "Owner",
  편집자: "Editor",
  뷰어: "Viewer",
  "아직 Collaborators가 없습니다": "No collaborators yet",
  참여일: "Joined",
  "제거 중...": "Removing...",
  제거: "Remove",
  "봉인된 기억": "Sealed Memory",
  "input 정보를 Confirm해주세요. 올바른 형식으로 input했는지 Confirm해주세요.":
    "Please check your input. Make sure you entered it in the correct format.",
  "Share 링크 생성에 실패했습니다": "Failed to create share link",
  봉인일: "Sealed on",
  부활일: "Resurrected on",
  "이 Time Capsule은 아직 잠겨있습니다": "This time capsule is still locked",
  일: "days",
  "남은 시간": "remaining",
  "잠금 해제일": "Unlock date",
  "과거로부터의 메시지": "Message from the past",
  "🪦 다시 묻기": "🪦 Rebury",
  "← 돌아가기": "← Go Back",
  "시간이 흘러도 기억은 남습니다": "Memories remain even as time passes",
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  for (const [korean, english] of Object.entries(translations)) {
    const regex = new RegExp(
      korean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g"
    );
    if (regex.test(content)) {
      content = content.replace(regex, english);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }

  return false;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules") {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

function main() {
  const srcDir = path.join(process.cwd(), "src");
  const files = getAllFiles(srcDir);

  let totalFiles = files.length;
  let modifiedFiles = 0;

  files.forEach((file) => {
    if (replaceInFile(file)) {
      modifiedFiles++;
    }
  });

  console.log(`\n✨ Translation complete!`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files modified: ${modifiedFiles}`);
}

main();
