export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot'

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-chat-in`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isBot
            ? 'bg-cream-200/50 border border-rose-light/20 rounded-2xl rounded-bl-sm'
            : 'bg-rose-pastel/30 border border-rose-light/30 rounded-2xl rounded-br-sm'
        } px-4 py-3`}
      >
        {/* Bot avatar label */}
        {isBot && (
          <p className="text-[10px] font-heading text-rose-accent uppercase tracking-widest mb-1.5">
            Enchanted Brush
          </p>
        )}

        {/* Text content */}
        {message.content && (
          <p className={`text-sm font-body leading-relaxed ${isBot ? 'text-enchanted' : 'text-enchanted'}`}>
            {message.content}
          </p>
        )}

        {/* Image */}
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Referência"
            className="rounded-xl max-h-48 object-cover mt-2 w-full"
          />
        )}
      </div>
    </div>
  )
}
