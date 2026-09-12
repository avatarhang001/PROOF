import { PanelHeader } from '../components/PanelHeader';
import { Reveal } from '../components/Reveal';
import { UsersIcon } from '../components/Icons';

export function TeachPage() {
  return (
    <div className="space-y-6">
      <Reveal>
        <PanelHeader title="Teach" />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <UsersIcon className="w-8 h-8 text-teal-500" />
            <h3 className="text-xl font-semibold text-gray-900">Teaching Opportunities</h3>
          </div>
          <p className="text-gray-600">Teaching and mentoring opportunities will appear here.</p>
        </div>
      </Reveal>
    </div>
  );
}
