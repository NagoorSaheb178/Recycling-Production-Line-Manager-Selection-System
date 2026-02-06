
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const sections = [
    {
      title: 'GENERAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
        { id: 'leaderboard', label: 'Rankings', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
        { id: 'intelligence', label: 'Intelligence', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'candidates', label: 'Candidate Pool', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
        { id: 'logistics', label: 'Logistics Index', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
        { id: 'safety', label: 'Safety Protocols', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
      ]
    },
    {
      title: 'OTHERS',
      items: [
        { id: 'users', label: 'User Admin', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        { id: 'settings', label: 'Settings', icon: (active: boolean) => <svg className={active ? 'text-emerald-700' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] lg:hidden transition-all duration-300" onClick={onClose} />
      )}
      <div className={`fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-50 flex flex-col z-[60] transition-transform duration-700 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 flex flex-col h-full overflow-hidden">
          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-14">
            <div className="w-12 h-12 bg-[#059669] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-emerald-900/10 transition-transform hover:scale-105">R</div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">RecycleFlow</span>
          </div>
          
          {/* Menu Sections with Custom Scrollbar */}
          <nav className="space-y-12 flex-1 overflow-y-auto no-scrollbar pr-2">
            {sections.map(sec => (
              <div key={sec.title}>
                <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.35em] mb-6 pl-4 leading-none">{sec.title}</h4>
                <div className="space-y-2">
                  {sec.items.map(item => {
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                          w-full flex items-center gap-5 px-6 py-4 rounded-[1.75rem] text-[13px] font-black transition-all group relative
                          ${active ? 'bg-emerald-50 text-emerald-800 shadow-sm' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        {item.icon(active)}
                        <span>{item.label}</span>
                        {active && <div className="absolute right-4 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Upgrade Banner Card */}
          <div className="pt-10">
            <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group cursor-pointer transition-all active:scale-95">
              <div className="relative z-10 text-center space-y-4">
                <p className="text-[11px] font-black leading-relaxed uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-200 transition-colors">
                   Unlock Advanced AI <br/> Analytics & Dashboard <br/> Personalization!
                </p>
                <button className="w-full bg-[#059669] text-white text-[10px] font-black uppercase tracking-[0.3em] py-4 rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-900/20 transition-all">
                  Upgrade Pro
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-600/10 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
