import { ChatsScreen } from "../screens/ChatsScreen";
import { useAppContext } from "../state/AppContext";

export function ChatsRoute() {
  const app = useAppContext();

  return (
    <ChatsScreen
      chats={app.chats}
      messages={app.chatMessages}
      notice={app.notice}
      focusedChatId={app.focusedChatId}
      onClearFocusedChat={app.clearFocusedChat}
    />
  );
}
