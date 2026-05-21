import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { SecondaryButton, SmallButton } from "../components/Button";
import { Notice } from "../components/Notice";
import { styles } from "../styles";
import type { Chat, ChatMessage } from "../types";

type ChatsScreenProps = {
  chats: Chat[];
  messages: ChatMessage[];
  notice: string;
};

export function ChatsScreen({ chats, messages, notice }: ChatsScreenProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [openSettingsChatId, setOpenSettingsChatId] = useState<string | null>(null);
  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>(["maya"]);
  const [blockedChatIds, setBlockedChatIds] = useState<string[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [chatNotice, setChatNotice] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  const visibleChats = useMemo(
    () =>
      chats
        .filter((chat) => !blockedChatIds.includes(chat.id))
        .sort((a, b) => Number(pinnedChatIds.includes(b.id)) - Number(pinnedChatIds.includes(a.id))),
    [blockedChatIds, chats, pinnedChatIds]
  );

  const selectedChat = visibleChats.find((chat) => chat.id === selectedChatId);

  function togglePin(chatId: string) {
    setPinnedChatIds((current) =>
      current.includes(chatId) ? current.filter((id) => id !== chatId) : [...current, chatId]
    );
    setChatNotice("");
    setOpenSettingsChatId(null);
  }

  function reportChat(chat: Chat) {
    setChatNotice(`${chat.title} was reported for review.`);
    setOpenSettingsChatId(null);
  }

  function blockChat(chat: Chat) {
    setBlockedChatIds((current) => [...current, chat.id]);
    setChatNotice(`${chat.title} was blocked and removed from chats.`);
    if (selectedChatId === chat.id) {
      setSelectedChatId(null);
    }
    setOpenSettingsChatId(null);
  }

  function sendMessage(chatId: string) {
    const content = draftMessage.trim();
    if (!content) {
      return;
    }

    setLocalMessages((current) => [
      ...current,
      {
        id: `local-${chatId}-${Date.now()}`,
        chatId,
        sender: "You",
        content,
        time: "Now",
        isMine: true
      }
    ]);
    setDraftMessage("");
  }

  if (selectedChat) {
    const selectedMessages = [...messages, ...localMessages].filter(
      (message) => message.chatId === selectedChat.id
    );

    return (
      <View style={styles.chatScreenRoot}>
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.cardTitle}>{selectedChat.title}</Text>
            <Text style={styles.metaText}>
              {selectedChat.kind} | {selectedChat.participants} participants
            </Text>
          </View>
          <SecondaryButton label="Back" onPress={() => setSelectedChatId(null)} />
        </View>

        <ScrollView
          style={styles.chatThreadScroll}
          contentContainerStyle={styles.chatThread}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          {selectedMessages.map((message) => (
            <View
              key={message.id}
              style={[styles.messageBubble, message.isMine && styles.messageBubbleMine]}
            >
              <Text style={[styles.messageSender, message.isMine && styles.messageSenderMine]}>
                {message.sender} | {message.time}
              </Text>
              <Text style={[styles.messageText, message.isMine && styles.messageTextMine]}>
                {message.content}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.messageComposer}>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={draftMessage}
            onChangeText={setDraftMessage}
            placeholder="Message"
            placeholderTextColor="#7C756A"
          />
          <SmallButton label="Send" onPress={() => sendMessage(selectedChat.id)} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.appRoot}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
    >
      <Notice text={chatNotice || notice} />
      {visibleChats.map((chat) => {
        const isPinned = pinnedChatIds.includes(chat.id);
        const settingsOpen = openSettingsChatId === chat.id;

        return (
          <View key={chat.id} style={styles.listCard}>
            <View style={styles.rowBetween}>
              <Pressable style={styles.flexOne} onPress={() => setSelectedChatId(chat.id)}>
                <Text style={styles.cardTitle}>
                  {isPinned ? "Pinned | " : ""}
                  {chat.title}
                </Text>
                <Text style={styles.metaText}>
                  {chat.kind} | {chat.participants} participants
                </Text>
              </Pressable>
              <SmallButton
                label="⚙"
                onPress={() => setOpenSettingsChatId(settingsOpen ? null : chat.id)}
              />
            </View>
            {settingsOpen ? (
              <View style={styles.chatActions}>
                <Pressable style={styles.chatActionButton} onPress={() => togglePin(chat.id)}>
                  <Text style={styles.chatActionText}>{isPinned ? "Unpin" : "Pin"}</Text>
                </Pressable>
                <Pressable style={styles.dangerIconButton} onPress={() => reportChat(chat)}>
                  <Text style={styles.dangerIconText}>!</Text>
                </Pressable>
                <Pressable style={styles.dangerIconButton} onPress={() => blockChat(chat)}>
                  <Text style={styles.dangerIconText}>✋</Text>
                </Pressable>
              </View>
            ) : null}
            <Pressable onPress={() => setSelectedChatId(chat.id)}>
              <Text style={styles.bodyText}>{chat.preview}</Text>
              {chat.expires ? <Text style={styles.warningText}>{chat.expires}</Text> : null}
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}
