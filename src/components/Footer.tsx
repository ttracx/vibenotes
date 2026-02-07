'use client';

export default function Footer() {
  return (
    <footer className="py-3 px-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>VibeNotes • $3.99/mo</span>
          <a href="#" className="hover:text-purple-500 transition-colors">
            Upgrade to Pro
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span>© 2026 VibeNotes powered by</span>
          <a
            href="https://vibecaas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors"
          >
            VibeCaaS.com
          </a>
          <span>a division of</span>
          <a
            href="https://www.neuralquantum.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors"
          >
            NeuralQuantum.ai LLC
          </a>
          <span>. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
