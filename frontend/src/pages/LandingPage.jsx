
import {
  Heart,
  Sparkles,
  MessageCircle,
  Brain,
  ShieldCheck,
  ArrowRight,
  Bot,
  Clock,
  Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: "Friendly Conversations",
      description:
        "Talk freely with Buddy. Share your thoughts, ask questions, and enjoy natural conversations.",
    },
    {
      icon: Brain,
      title: "Smart AI Assistant",
      description:
        "Get help with studies, programming, productivity, planning, and everyday questions.",
    },
    {
      icon: Clock,
      title: "Conversation History",
      description:
        "Continue your previous conversations whenever you return to Buddy.",
    },
    {
      icon: ShieldCheck,
      title: "Private Conversations",
      description:
        "Your conversations are associated with your account and protected by authentication.",
    },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-navbar">
        <div className="landing-brand">
          <div className="landing-logo">
            <Heart size={23} fill="white" />
          </div>
          <span>Buddy</span>
        </div>

        <div className="landing-nav-actions">
          <button
            className="landing-login-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

          <button
            className="landing-start-button"
            onClick={() => navigate("/login")}
          >
            Get Started <ArrowRight size={17} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-tag">
            <Sparkles size={15} />
            YOUR AI FRIEND & SMART ASSISTANT
          </div>

          <h1>
            A Friend Who's
            <br />
            <span>Always There</span>
            <br />
            For You.
          </h1>

          <p>
            Meet Buddy, your friendly AI companion. Have meaningful
            conversations, explore ideas, get things done, and make
            every day a little easier.
          </p>

          <div className="landing-hero-actions">
            <button
              className="landing-start-button hero-button"
              onClick={() => navigate("/login")}
            >
              Start Chatting <ArrowRight size={19} />
            </button>

            <button
              className="landing-secondary-button"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Features
            </button>
          </div>

          <div className="landing-trust">
            <div className="landing-trust-icon">
              <Heart size={17} fill="currentColor" />
            </div>
            <span>A little conversation can make a big difference.</span>
          </div>
        </div>

        {/* Decorative AI card */}
        <div className="landing-visual">
          <div className="landing-glow" />

          <div className="landing-chat-card">
            <div className="landing-chat-top">
              <div className="landing-bot-icon">
                <Bot size={27} />
              </div>

              <div>
                <strong>Buddy AI</strong>
                <span>Always ready to chat</span>
              </div>

              <div className="landing-online-dot" />
            </div>

            <div className="landing-chat-body">
              <div className="landing-date">YOUR FRIENDLY AI COMPANION</div>

              <div className="landing-buddy-message">
                Hey there! 👋
                <br />
                I'm Buddy. How is your day going?
              </div>

              <div className="landing-user-message">
                I need some help with my studies.
              </div>

              <div className="landing-buddy-message">
                Of course! 😊 Let's work through it together.
                What are you learning today?
              </div>

              <div className="landing-typing">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="landing-chat-bottom">
              <span>Message Buddy...</span>
              <div>
                <ArrowRight size={18} />
              </div>
            </div>
          </div>

          <div className="landing-floating-card floating-one">
            <Heart size={17} fill="currentColor" />
            <span>Always here for you</span>
          </div>

          <div className="landing-floating-card floating-two">
            <Sparkles size={17} />
            <span>Smart assistance</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div className="landing-section-heading">
          <span>WHAT BUDDY OFFERS</span>
          <h2>More than just a chatbot.</h2>
          <p>
            A friendly companion and a helpful assistant, all in one place.
          </p>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="landing-feature-card" key={feature.title}>
                <div className="landing-feature-icon">
                  <Icon size={24} />
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="landing-cta">
        <div className="landing-cta-icon">
          <Star size={25} fill="currentColor" />
        </div>

        <h2>Ready to meet your new AI friend?</h2>
        <p>Your next conversation with Buddy starts here.</p>

        <button
          className="landing-start-button hero-button"
          onClick={() => navigate("/login")}
        >
          Get Started with Buddy <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-brand">
          <div className="landing-logo">
            <Heart size={18} fill="white" />
          </div>
          <span>Buddy</span>
        </div>

        <p>Made with <Heart size={13} fill="currentColor" /> for you.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
