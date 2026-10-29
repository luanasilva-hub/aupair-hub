import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldAlert, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  Send, 
  Smile, 
  Clock, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Utensils,
  CheckSquare,
  Bus,
  Check,
  PhoneCall,
  AlertTriangle,
  Pill,
  FileText,
  Bell,
  BellRing,
  Camera,
  Eye,
  ShoppingBag,
  History,
  Save,
  Printer,
  GraduationCap,
  Target,
  Moon,
  Baby,
  Palette,
  CalendarDays,
  Home,
  UserCheck,
  HeartPulse,
  Image as ImageIcon,
  FileCheck,
  ListPlus
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  institution: string;
  hours: string;
  completed: boolean;
}

interface MilestoneGoal {
  id: string;
  title: string;
  completed: boolean;
}

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  notes: string;
}

interface WeeklyEvent {
  id: string;
  day: string;
  time: string;
  title: string;
}

interface ChildSchedule {
  id: string;
  name: string;
  age: string;
  routine: string;
  schoolDismissal: string;
  pickupInfo: string;
  bagChecklist: string;
  bathDone: boolean;
  homeworkDone: boolean;
  screenTimeDone: boolean;
  mealsNotes: string;
  napTime: string;
  diaperCount: number;
  pottySuccess: boolean;
  insuranceName: string;
  insurancePolicy: string;
  hospitalPreference: string;
  pediatricianName: string;
  pediatricianPhone: string;
  activities: ActivityItem[];
  weeklyEvents: WeeklyEvent[];
}

interface EmergencyContact {
  id: string;
  label: string;
  phone: string;
}

interface Medication {
  id: string;
  name: string;
  dose: string;
  time: string;
  alarmActive?: boolean;
}

interface HouseLocation {
  id: string;
  item: string;
  location: string;
}

interface PermissionForm {
  id: string;
  title: string;
  details: string;
  approved: boolean;
}

interface SavedDay {
  id: string;
  date: string;
  auPairMood: string;
  energyLevel: number;
  summaryText: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'aupair' | 'schedule' | 'safety' | 'parents'>('aupair');

  // ==========================================
  // --- ABA 1: MEU ESPAÇO ---
  // ==========================================
  const [auPairName, setAuPairName] = useState(() => localStorage.getItem('auPairName') || '');
  const [auPairAge, setAuPairAge] = useState(() => localStorage.getItem('auPairAge') || '');
  const [weeklyStipend, setWeeklyStipend] = useState(() => localStorage.getItem('weeklyStipend') || '');
  
  const [totalHours, setTotalHours] = useState<number>(() => {
    const saved = localStorage.getItem('totalHours');
    return saved ? parseFloat(saved) : 0;
  });
  const [weeklyHours, setWeeklyHours] = useState<number>(() => {
    const saved = localStorage.getItem('weeklyHours');
    return saved ? parseFloat(saved) : 0;
  });
  const [addHoursInput, setAddHoursInput] = useState<string>('');

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : [];
  });
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseInst, setNewCourseInst] = useState('');
  const [newCourseHours, setNewCourseHours] = useState('');
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  const [goals, setGoals] = useState<MilestoneGoal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const [auPairMood, setAuPairMood] = useState(() => localStorage.getItem('auPairMood') || 'Bem');
  const [energyLevel, setEnergyLevel] = useState<number>(() => {
    const saved = localStorage.getItem('energyLevel');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [auPairConquest, setAuPairConquest] = useState(() => localStorage.getItem('auPairConquest') || '');
  const [auPairChallenge, setAuPairChallenge] = useState(() => localStorage.getItem('auPairChallenge') || '');
  const [auPairGratitude, setAuPairGratitude] = useState(() => localStorage.getItem('auPairGratitude') || '');

  const [history, setHistory] = useState<SavedDay[]>(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('auPairName', auPairName); }, [auPairName]);
  useEffect(() => { localStorage.setItem('auPairAge', auPairAge); }, [auPairAge]);
  useEffect(() => { localStorage.setItem('weeklyStipend', weeklyStipend); }, [weeklyStipend]);
  useEffect(() => { localStorage.setItem('totalHours', totalHours.toString()); }, [totalHours]);
  useEffect(() => { localStorage.setItem('weeklyHours', weeklyHours.toString()); }, [weeklyHours]);
  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('auPairMood', auPairMood); }, [auPairMood]);
  useEffect(() => { localStorage.setItem('energyLevel', energyLevel.toString()); }, [energyLevel]);
  useEffect(() => { localStorage.setItem('auPairConquest', auPairConquest); }, [auPairConquest]);
  useEffect(() => { localStorage.setItem('auPairChallenge', auPairChallenge); }, [auPairChallenge]);
  useEffect(() => { localStorage.setItem('auPairGratitude', auPairGratitude); }, [auPairGratitude]);
  useEffect(() => { localStorage.setItem('history', JSON.stringify(history)); }, [history]);

  const handleAddHours = () => {
    const parsed = parseFloat(addHoursInput);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalHours(prev => prev + parsed);
      setWeeklyHours(prev => prev + parsed);
      setAddHoursInput('');
    }
  };

  const handleResetWeeklyHours = () => {
    if (confirm('Deseja zerar a contagem de horas da semana?')) {
      setWeeklyHours(0);
    }
  };

  const handleClearAllData = () => {
    if (confirm('⚠️ ATENÇÃO: Deseja apagar TODOS os dados e zerar o aplicativo por completo?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleAddCourse = () => {
    if (!newCourseName.trim()) return;
    const newC: Course = {
      id: Date.now().toString(),
      name: newCourseName,
      institution: newCourseInst || 'Curso',
      hours: newCourseHours ? `${newCourseHours}h` : '',
      completed: false
    };
    setCourses([...courses, newC]);
    setNewCourseName('');
    setNewCourseInst('');
    setNewCourseHours('');
    setShowAddCourseForm(false);
  };

  const toggleCourseStatus = (id: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    setGoals([...goals, { id: Date.now().toString(), title: newGoalTitle, completed: false }]);
    setNewGoalTitle('');
  };

  const toggleGoalStatus = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // ==========================================
  // --- ABA 2: CRONOGRAMA, ESCOLA & HÁBITOS ---
  // ==========================================
  const [children, setChildren] = useState<ChildSchedule[]>(() => {
    const saved = localStorage.getItem('children');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Criança 1',
        age: '',
        routine: '',
        schoolDismissal: '',
        pickupInfo: '',
        bagChecklist: '',
        bathDone: false,
        homeworkDone: false,
        screenTimeDone: false,
        mealsNotes: '',
        napTime: '',
        diaperCount: 0,
        pottySuccess: false,
        insuranceName: '',
        insurancePolicy: '',
        hospitalPreference: '',
        pediatricianName: '',
        pediatricianPhone: '',
        activities: [],
        weeklyEvents: []
      }
    ];
  });
  const [selectedChildId, setSelectedChildId] = useState<string>('1');

  const [newActTitle, setNewActTitle] = useState('');
  const [newActCategory, setNewActCategory] = useState('Artes');
  const [newActDuration, setNewActDuration] = useState('');
  const [newActNotes, setNewActNotes] = useState('');

  const [newEventDay, setNewEventDay] = useState('Segunda-feira');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');

  useEffect(() => { localStorage.setItem('children', JSON.stringify(children)); }, [children]);

  const activeChild = children.find(c => c.id === selectedChildId) || children[0];

  const handleAddChild = () => {
    const newId = Date.now().toString();
    const newChild: ChildSchedule = {
      id: newId,
      name: `Criança ${children.length + 1}`,
      age: '',
      routine: '',
      schoolDismissal: '',
      pickupInfo: '',
      bagChecklist: '',
      bathDone: false,
      homeworkDone: false,
      screenTimeDone: false,
      mealsNotes: '',
      napTime: '',
      diaperCount: 0,
      pottySuccess: false,
      insuranceName: '',
      insurancePolicy: '',
      hospitalPreference: '',
      pediatricianName: '',
      pediatricianPhone: '',
      activities: [],
      weeklyEvents: []
    };
    setChildren([...children, newChild]);
    setSelectedChildId(newId);
  };

  const handleRemoveChild = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (children.length === 1) {
      alert('É necessário ter pelo menos uma criança cadastrada.');
      return;
    }
    const updated = children.filter(c => c.id !== id);
    setChildren(updated);
    if (selectedChildId === id) {
      setSelectedChildId(updated[0].id);
    }
  };

  const updateActiveChild = (field: keyof ChildSchedule, value: any) => {
    setChildren(children.map(c => {
      if (c.id === selectedChildId) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const handleAddActivity = () => {
    if (!newActTitle.trim()) return;
    const newAct: ActivityItem = {
      id: Date.now().toString(),
      title: newActTitle,
      category: newActCategory,
      duration: newActDuration || '30 min',
      notes: newActNotes
    };
    const updatedActivities = [...(activeChild.activities || []), newAct];
    updateActiveChild('activities', updatedActivities);
    setNewActTitle('');
    setNewActDuration('');
    setNewActNotes('');
  };

  const handleRemoveActivity = (actId: string) => {
    const updated = (activeChild.activities || []).filter(a => a.id !== actId);
    updateActiveChild('activities', updated);
  };

  const handleAddWeeklyEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEv: WeeklyEvent = {
      id: Date.now().toString(),
      day: newEventDay,
      time: newEventTime || 'Horário Livre',
      title: newEventTitle
    };
    const updatedEvents = [...(activeChild.weeklyEvents || []), newEv];
    updateActiveChild('weeklyEvents', updatedEvents);
    setNewEventTitle('');
    setNewEventTime('');
  };

  const handleRemoveWeeklyEvent = (evId: string) => {
    const updated = (activeChild.weeklyEvents || []).filter(e => e.id !== evId);
    updateActiveChild('weeklyEvents', updated);
  };

  const handleArchiveDay = () => {
    const todayStr = new Date().toLocaleDateString('pt-BR');
    
    const newDay: SavedDay = {
      id: Date.now().toString(),
      date: todayStr,
      auPairMood: auPairMood,
      energyLevel: energyLevel,
      summaryText: `Conquista: ${auPairConquest || 'N/A'} | Desafio: ${auPairChallenge || 'N/A'}`
    };

    setHistory([newDay, ...history]);
    
    setAuPairConquest('');
    setAuPairChallenge('');
    setAuPairGratitude('');

    const resetChildren = children.map(c => ({
      ...c,
      bathDone: false,
      homeworkDone: false,
      screenTimeDone: false,
      mealsNotes: '',
      diaperCount: 0,
      pottySuccess: false,
      activities: []
    }));
    setChildren(resetChildren);
    
    alert(`Diário do dia ${todayStr} arquivado com sucesso!`);
  };

  // ==========================================
  // --- ABA 3: SEGURANÇA & EMERGÊNCIA ---
  // ==========================================
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('contacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newContactLabel, setNewContactLabel] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const [allergiesList, setAllergiesList] = useState<string[]>(() => {
    const saved = localStorage.getItem('allergiesList');
    return saved ? JSON.parse(saved) : [];
  });
  const [newAllergy, setNewAllergy] = useState('');

  const [medicationsList, setMedicationsList] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medicationsList');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedTime, setNewMedTime] = useState('');

  const [houseLocations, setHouseLocations] = useState<HouseLocation[]>(() => {
    const saved = localStorage.getItem('houseLocations');
    return saved ? JSON.parse(saved) : [];
  });
  const [newItemName, setNewItemName] = useState('');
  const [newItemLoc, setNewItemLoc] = useState('');

  const [visitorRules, setVisitorRules] = useState(() => localStorage.getItem('visitorRules') || '');

  useEffect(() => { localStorage.setItem('contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('allergiesList', JSON.stringify(allergiesList)); }, [allergiesList]);
  useEffect(() => { localStorage.setItem('medicationsList', JSON.stringify(medicationsList)); }, [medicationsList]);
  useEffect(() => { localStorage.setItem('houseLocations', JSON.stringify(houseLocations)); }, [houseLocations]);
  useEffect(() => { localStorage.setItem('visitorRules', visitorRules); }, [visitorRules]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      medicationsList.forEach(med => {
        if (med.alarmActive && med.time === currentFormatted) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`⏰ Hora do Medicamento: ${med.name}`, {
              body: `Dar a dosagem de ${med.dose} agora!`,
            });
          } else {
            alert(`⏰ HORA DO REMÉDIO!\n\n${med.name} (${med.dose})`);
          }
        }
      });
    }, 30000);

    return () => clearInterval(timer);
  }, [medicationsList]);

  const toggleAlarm = (id: string) => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    setMedicationsList(medicationsList.map(med => {
      if (med.id === id) {
        const nextState = !med.alarmActive;
        if (nextState) {
          alert(`Alarme ativado para ${med.name} às ${med.time}!`);
        }
        return { ...med, alarmActive: nextState };
      }
      return med;
    }));
  };

  const handleAddContact = () => {
    if (!newContactLabel.trim() || !newContactPhone.trim()) return;
    setContacts([...contacts, { id: Date.now().toString(), label: newContactLabel, phone: newContactPhone }]);
    setNewContactLabel('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setAllergiesList([...allergiesList, newAllergy]);
    setNewAllergy('');
  };

  const handleRemoveAllergy = (item: string) => {
    setAllergiesList(allergiesList.filter(a => a !== item));
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    setMedicationsList([...medicationsList, {
      id: Date.now().toString(),
      name: newMedName,
      dose: newMedDose || 'Dose padrão',
      time: newMedTime || '12:00',
      alarmActive: false
    }]);
    setNewMedName('');
    setNewMedDose('');
    setNewMedTime('');
  };

  const handleRemoveMedication = (id: string) => {
    setMedicationsList(medicationsList.filter(m => m.id !== id));
  };

  const handleAddHouseLocation = () => {
    if (!newItemName.trim() || !newItemLoc.trim()) return;
    setHouseLocations([...houseLocations, { id: Date.now().toString(), item: newItemName, location: newItemLoc }]);
    setNewItemName('');
    setNewItemLoc('');
  };

  const handleRemoveHouseLocation = (id: string) => {
    setHouseLocations(houseLocations.filter(h => h.id !== id));
  };

  // ==========================================
  // --- ABA 4: CENTRAL DOS PAIS ---
  // ==========================================
  const [msgType, setMsgType] = useState<'daily' | 'arrival' | 'shopping'>('daily');
  
  const [foodItems, setFoodItems] = useState('');
  const [hygieneItems, setHygieneItems] = useState('');
  const [schoolItems, setSchoolItems] = useState('');

  const [photoUrls, setPhotoUrls] = useState<string[]>(() => {
    const saved = localStorage.getItem('photoUrls');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPhotoInput, setNewPhotoInput] = useState('');

  const [permissions, setPermissions] = useState<PermissionForm[]>(() => {
    const saved = localStorage.getItem('permissions');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPermTitle, setNewPermTitle] = useState('');
  const [newPermDetails, setNewPermDetails] = useState('');

  useEffect(() => { localStorage.setItem('photoUrls', JSON.stringify(photoUrls)); }, [photoUrls]);
  useEffect(() => { localStorage.setItem('permissions', JSON.stringify(permissions)); }, [permissions]);

  const handleAddPhotoUrl = () => {
    if (!newPhotoInput.trim()) return;
    setPhotoUrls([...photoUrls, newPhotoInput]);
    setNewPhotoInput('');
  };

  const handleRemovePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const handleAddPermission = () => {
    if (!newPermTitle.trim()) return;
    setPermissions([...permissions, {
      id: Date.now().toString(),
      title: newPermTitle,
      details: newPermDetails || 'Sem detalhes adicionais',
      approved: false
    }]);
    setNewPermTitle('');
    setNewPermDetails('');
  };

  const togglePermissionApproved = (id: string) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, approved: !p.approved } : p));
  };

  const handleRemovePermission = (id: string) => {
    setPermissions(permissions.filter(p => p.id !== id));
  };

  const buildWhatsAppText = () => {
    if (msgType === 'arrival') {
      return `Olá! Passando para avisar que já cheguei e está tudo ótimo por aqui! 😊🌸\n\nAu Pair: ${auPairName || 'Au Pair'}`;
    }

    if (msgType === 'shopping') {
      let text = `Olá! Lembrete de reposição de itens:\n\n🛍️ *LISTA DE REPOSIÇÃO:*\n`;
      if (foodItems) text += `\n🍎 *Alimentação:* ${foodItems}`;
      if (hygieneItems) text += `\n🧼 *Higiene/Fraldas:* ${hygieneItems}`;
      if (schoolItems) text += `\n✏️ *Escola/Outros:* ${schoolItems}`;
      if (!foodItems && !hygieneItems && !schoolItems) text += `\n- Nenhum item pendente informado`;
      text += `\n\nObrigada! ❤️`;
      return text;
    }

    let msg = `*AuPair Hub - Daily Care Report* 🌸\n\n`;
    if (auPairName) msg += `👤 *Au Pair:* ${auPairName}\n\n`;

    children.forEach((child, index) => {
      msg += `--- *${child.name || `Criança ${index + 1}`}* (${child.age || 'Idade N/I'}) ---\n`;
      if (child.schoolDismissal) msg += `🏫 *Saída da Escola:* ${child.schoolDismissal} (${child.pickupInfo || 'N/A'})\n`;
      if (child.napTime) msg += `😴 *Sesta/Sono:* ${child.napTime}\n`;
      if (child.diaperCount > 0 || child.pottySuccess) msg += `👶 *Higiene:* ${child.diaperCount} trocas de fralda | ${child.pottySuccess ? 'Uso do banheiro OK ✅' : ''}\n`;
      if (child.routine) msg += `🕒 *Rotina:* \n${child.routine}\n`;
      if (child.mealsNotes) msg += `🍎 *Alimentação:* ${child.mealsNotes}\n`;
      
      if (child.activities && child.activities.length > 0) {
        msg += `🎨 *Atividades de Hoje:* ${child.activities.map(a => `${a.title} (${a.category})`).join(', ')}\n`;
      }

      const checks = [];
      if (child.bathDone) checks.push('Banho tomado');
      if (child.homeworkDone) checks.push('Dever de casa OK');
      if (child.screenTimeDone) checks.push('Tempo de tela OK');
      if (checks.length > 0) msg += `✅ *Checklist:* ${checks.join(', ')}\n`;

      msg += `\n`;
    });

    if (photoUrls.length > 0) {
      msg += `📷 *Fotos do Dia (${photoUrls.length}):* \n${photoUrls.join('\n')}\n\n`;
    }

    msg += `Tudo sob controle por aqui! Tenham uma excelente noite! ❤️`;
    return msg;
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getPageBg = () => {
    switch (activeTab) {
      case 'aupair': return 'bg-rose-50/60';
      case 'schedule': return 'bg-sky-50/60';
      case 'safety': return 'bg-amber-50/50';
      case 'parents': return 'bg-emerald-50/60';
      default: return 'bg-rose-50/60';
    }
  };

  return (
    <div className={`min-h-screen text-slate-800 pb-48 transition-colors duration-300 ${getPageBg()}`}>
      
      {/* FOLHA A4 PARA IMPRESSÃO / PDF */}
      <div className="hidden print:block p-8 bg-white text-slate-900 font-sans max-w-2xl mx-auto">
        <div className="border-b-2 border-rose-400 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-rose-600">AuPair Hub — Daily Routine</h1>
            <p className="text-xs text-slate-500">Au Pair / Cuidadora: {auPairName || '__________'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400">Data: ____/____/________</p>
          </div>
        </div>

        {children.map((child) => (
          <div key={child.id} className="mb-6 border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <h2 className="font-bold text-base text-slate-800">{child.name || 'Criança'} ({child.age || 'Idade N/I'})</h2>
              <span className="text-xs text-slate-500">Saída Escola: {child.schoolDismissal || 'N/I'}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-700 mb-1">🕒 Rotina & Horários:</p>
                <p className="whitespace-pre-line text-slate-600 leading-relaxed bg-slate-50 p-2 rounded">{child.routine || 'Sem horários cadastrados'}</p>
                
                {child.activities && child.activities.length > 0 && (
                  <div className="mt-2">
                    <p className="font-bold text-slate-700 mb-1">🎨 Atividades de Hoje:</p>
                    <ul className="list-disc pl-4 text-slate-600">
                      {child.activities.map(a => (
                        <li key={a.id}>{a.title} ({a.category}) - {a.duration}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="font-bold text-slate-700">Checklist do Dia:</p>
                <p>[ {child.bathDone ? 'X' : '  '} ] Banho Tomado</p>
                <p>[ {child.homeworkDone ? 'X' : '  '} ] Dever de Casa OK</p>
                <p>[ {child.screenTimeDone ? 'X' : '  '} ] Tempo de Tela OK</p>
                <p>😴 Sesta: {child.napTime || 'Não dormiu'}</p>
                <p>👶 Fraldas: {child.diaperCount} trocas | Banheiro: {child.pottySuccess ? 'OK' : 'Pendente'}</p>
                
                <p className="font-bold text-slate-700 pt-2">🍎 Alimentação / Anotações:</p>
                <p className="text-slate-600 bg-slate-50 p-2 rounded">{child.mealsNotes || 'Anote aqui o que comeu...'}</p>
              </div>
            </div>

            {child.insuranceName && (
              <div className="mt-3 pt-2 border-t text-[11px] text-slate-600">
                <p>🏥 <strong>Plano de Saúde:</strong> {child.insuranceName} ({child.insurancePolicy}) | <strong>Hospital:</strong> {child.hospitalPreference}</p>
                <p>👨‍⚕️ <strong>Pediatra:</strong> {child.pediatricianName} ({child.pediatricianPhone})</p>
              </div>
            )}
          </div>
        ))}

        {photoUrls.length > 0 && (
          <div className="mb-6 border border-slate-200 rounded-xl p-4 text-xs">
            <p className="font-bold text-slate-700 mb-2">📷 Registros Fotográficos do Dia ({photoUrls.length}):</p>
            <div className="grid grid-cols-3 gap-2">
              {photoUrls.map((url, idx) => (
                <img key={idx} src={url} alt={`Registro ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border" />
              ))}
            </div>
          </div>
        )}

        {permissions.length > 0 && (
          <div className="mb-6 border border-emerald-200 bg-emerald-50/20 rounded-xl p-4 text-xs">
            <p className="font-bold text-emerald-800 mb-2">📄 AUTORIZAÇÕES DOS PAIS:</p>
            {permissions.map(p => (
              <p key={p.id}>[{p.approved ? ' APROVADO ' : ' PENDENTE '}] <strong>{p.title}:</strong> {p.details}</p>
            ))}
          </div>
        )}

        <div className="border border-red-200 bg-red-50/30 rounded-xl p-4 text-xs mt-6">
          <h3 className="font-bold text-red-700 mb-2">⚠️ PROTOCOLO DE SEGURANÇA & EMERGÊNCIA</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-slate-800">Alergias:</p>
              <p className="text-red-600 font-medium">{allergiesList.join(', ') || 'Nenhuma informada'}</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">Contatos de Emergência:</p>
              {contacts.map(c => (
                <p key={c.id}>{c.label}: {c.phone}</p>
              ))}
            </div>
          </div>
          {medicationsList.length > 0 && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <p className="font-bold text-slate-800">Remédios:</p>
              {medicationsList.map(m => (
                <p key={m.id}>{m.name} ({m.dose}) — Horário: {m.time}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* INTERFACE MOBILE */}
      <div className="print:hidden">
        {/* Cabeçalho */}
        <header className="bg-white border-b border-slate-100 sticky top-0 z-10 px-4 py-3 shadow-sm">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl transition-colors ${
                activeTab === 'aupair' ? 'bg-rose-100 text-rose-600' :
                activeTab === 'schedule' ? 'bg-sky-100 text-sky-600' :
                activeTab === 'safety' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-lg leading-tight">AuPair Hub</h1>
                <p className={`text-xs font-semibold transition-colors ${
                  activeTab === 'aupair' ? 'text-rose-500' :
                  activeTab === 'schedule' ? 'text-sky-500' :
                  activeTab === 'safety' ? 'text-amber-600' :
                  'text-emerald-600'
                }`}>
                  {activeTab === 'aupair' && 'Carreira, Estudos & Bem-Estar'}
                  {activeTab === 'schedule' && 'Cronograma, Atividades & Hábitos'}
                  {activeTab === 'safety' && 'Segurança & Emergências'}
                  {activeTab === 'parents' && 'Central dos Pais (Parent Hub)'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto p-4 space-y-4">

          {/* ABA 1: MEU ESPAÇO */}
          {activeTab === 'aupair' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                    <User className="w-4 h-4" />
                    <h2>Perfil & Contrato de Trabalho</h2>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Seu Nome</label>
                    <input
                      type="text"
                      value={auPairName}
                      onChange={(e) => setAuPairName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 bg-rose-50/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Idade</label>
                    <input
                      type="text"
                      value={auPairAge}
                      onChange={(e) => setAuPairAge(e.target.value)}
                      placeholder="Ex: 28"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 bg-rose-50/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Estipêndio/sem ($)</label>
                    <input
                      type="text"
                      value={weeklyStipend}
                      onChange={(e) => setWeeklyStipend(e.target.value)}
                      placeholder="Ex: 215"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 bg-rose-50/20 font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-5 rounded-2xl text-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-rose-100 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Controle de Horas Trabalhadas</span>
                  </div>
                  <span className="text-xs bg-rose-900/40 px-2.5 py-1 rounded-full text-rose-100 border border-rose-300/30">
                    Limite: 45h/sem
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <p className="text-[10px] text-rose-100 font-medium">ESTA SEMANA</p>
                    <p className="text-2xl font-bold">{weeklyHours}h <span className="text-xs font-normal text-rose-200">/ 45h</span></p>
                    <div className="w-full bg-rose-900/40 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${weeklyHours >= 45 ? 'bg-amber-300' : 'bg-white'}`}
                        style={{ width: `${Math.min((weeklyHours / 45) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <p className="text-[10px] text-rose-100 font-medium">TOTAL ACUMULADO</p>
                    <p className="text-2xl font-bold">{totalHours}h</p>
                    <p className="text-[10px] text-rose-200 mt-1">Comprovação em Agências</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="number"
                    value={addHoursInput}
                    onChange={(e) => setAddHoursInput(e.target.value)}
                    placeholder="Somar horas de hoje (ex: 7)"
                    className="w-full px-3 py-2 text-sm rounded-xl text-slate-800 placeholder:text-slate-400 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <button
                    onClick={handleAddHours}
                    className="px-4 py-2 bg-rose-900/50 hover:bg-rose-900/70 text-white font-medium text-xs rounded-xl transition-all whitespace-nowrap border border-rose-300/30"
                  >
                    + Registrar
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    onClick={handleResetWeeklyHours} 
                    className="text-[10px] text-rose-200 hover:text-white underline transition-colors"
                  >
                    Zerar contagem da semana
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                    <GraduationCap className="w-4 h-4" />
                    <h2>Estudos & Certificados</h2>
                  </div>
                  <button
                    onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                    className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {showAddCourseForm && (
                  <div className="p-3 bg-rose-50/40 border border-rose-200 rounded-xl space-y-2 animate-fade-in">
                    <input
                      type="text"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      placeholder="Nome do curso (ex: CPR, Inglês)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newCourseInst}
                        onChange={(e) => setNewCourseInst(e.target.value)}
                        placeholder="Instituição / College"
                        className="px-3 py-1.5 text-xs rounded-lg border border-rose-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                      />
                      <input
                        type="text"
                        value={newCourseHours}
                        onChange={(e) => setNewCourseHours(e.target.value)}
                        placeholder="Horas (ex: 12)"
                        className="px-3 py-1.5 text-xs rounded-lg border border-rose-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setShowAddCourseForm(false)} className="px-3 py-1 text-xs text-slate-500">Cancelar</button>
                      <button onClick={handleAddCourse} className="px-3 py-1 bg-rose-500 text-white font-medium text-xs rounded-lg">Salvar Curso</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {courses.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-2">Nenhum curso cadastrado ainda.</p>
                  ) : (
                    courses.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-rose-50/30 border border-rose-100 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <button 
                            onClick={() => toggleCourseStatus(c.id)}
                            className={`p-1.5 rounded-lg transition-colors ${c.completed ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-400'}`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <div>
                            <p className={`text-xs font-semibold leading-snug ${c.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{c.name}</p>
                            <p className="text-[10px] text-slate-500">{c.institution} {c.hours && `• ${c.hours}`}</p>
                          </div>
                        </div>
                        <button onClick={() => handleRemoveCourse(c.id)} className="text-slate-300 hover:text-red-400 p-1 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                  <Target className="w-4 h-4" />
                  <h2>Metas do Intercâmbio & Visto</h2>
                </div>

                <div className="space-y-2">
                  {goals.length === 0 ? (
                    <p className="text-xs text-slate-400 py-1">Nenhuma meta cadastrada.</p>
                  ) : (
                    goals.map((g) => (
                      <div key={g.id} className="flex items-center justify-between p-2.5 bg-rose-50/20 border border-rose-100 rounded-xl">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleGoalStatus(g.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${g.completed ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-300'}`}
                          >
                            {g.completed && <Check className="w-3 h-3" />}
                          </button>
                          <span className={`text-xs ${g.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{g.title}</span>
                        </div>
                        <button onClick={() => handleRemoveGoal(g.id)} className="text-slate-300 hover:text-red-400 p-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="Nova meta (ex: Conhecer NY)"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-rose-200 bg-rose-50/20"
                  />
                  <button
                    onClick={handleAddGoal}
                    className="px-3 py-1.5 bg-rose-500 text-white text-xs font-medium rounded-xl whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                  <Smile className="w-4 h-4" />
                  <h2>Diário de Bordo & Saúde Mental</h2>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-600">Nível de Energia Hoje</label>
                    <span className="text-xs font-bold text-rose-600">{energyLevel} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setEnergyLevel(lvl)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          energyLevel === lvl 
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm' 
                            : 'bg-rose-50/30 text-slate-600 border-rose-100'
                        }`}
                      >
                        ⚡ {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-2">Humor Predominante</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Radiante', 'Bem', 'Neutro', 'Cansada', 'Saudade'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setAuPairMood(m)}
                        className={`py-2 px-1 text-xs rounded-xl font-medium border transition-all ${
                          auPairMood === m
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-rose-50/30 text-slate-600 border-rose-100 hover:bg-rose-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Superação ou Conquista do Dia</label>
                    <textarea
                      rows={2}
                      value={auPairConquest}
                      onChange={(e) => setAuPairConquest(e.target.value)}
                      placeholder="O que você conseguiu hoje?"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 bg-rose-50/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Maior Desafio do Dia</label>
                    <textarea
                      rows={2}
                      value={auPairChallenge}
                      onChange={(e) => setAuPairChallenge(e.target.value)}
                      placeholder="O que foi difícil?"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 bg-rose-50/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Momento de Gratidão</label>
                    <textarea
                      rows={2}
                      value={auPairGratitude}
                      onChange={(e) => setAuPairGratitude(e.target.value)}
                      placeholder="Uma memória boa do dia..."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 bg-rose-50/20 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleArchiveDay}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar e Iniciar Novo Dia</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                  <History className="w-4 h-4" />
                  <h2>Histórico de Diários Anteriores</h2>
                </div>

                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">Nenhum dia arquivado no histórico ainda.</p>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="p-3 bg-rose-50/20 border border-rose-100 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">📅 {item.date}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">⚡ {item.energyLevel || 5}/5</span>
                            <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">{item.auPairMood}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{item.summaryText}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* BOTÃO DE RESET COMPLETO */}
              <div className="pt-4 text-center">
                <button
                  onClick={handleClearAllData}
                  className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium py-2 px-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 transition-all"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Zerar todos os dados do aplicativo</span>
                </button>
              </div>

            </div>
          )}

          {/* ABA 2: CRONOGRAMA, ESCOLA & HÁBITOS */}
          {activeTab === 'schedule' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-3 rounded-2xl border border-sky-100 shadow-sm space-y-2">
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider block px-1">Crianças Cadastradas:</span>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {children.map((child) => {
                    const isSelected = child.id === selectedChildId;
                    return (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChildId(child.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                          isSelected 
                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm' 
                            : 'bg-sky-50/50 text-slate-600 border-sky-200 hover:bg-sky-100'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{child.name || 'Sem nome'}</span>
                        {children.length > 1 && (
                          <Trash2 
                            className={`w-3 h-3 hover:text-red-200 transition-colors ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}
                            onClick={(e) => handleRemoveChild(child.id, e)}
                          />
                        )}
                      </button>
                    );
                  })}

                  <button
                    onClick={handleAddChild}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-sky-300 text-sky-600 hover:bg-sky-50 transition-all whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Criança</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                  <User className="w-4 h-4" />
                  <h2>Dados da Criança</h2>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-slate-600 block mb-1">Nome</label>
                    <input
                      type="text"
                      value={activeChild.name}
                      onChange={(e) => updateActiveChild('name', e.target.value)}
                      placeholder="Nome da criança"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-sky-50/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Idade</label>
                    <input
                      type="text"
                      value={activeChild.age}
                      onChange={(e) => updateActiveChild('age', e.target.value)}
                      placeholder="Ex: 4 anos"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-sky-50/20"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                  <Moon className="w-4 h-4" />
                  <h2>Sesta, Fraldas & Banheiro</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Horário da Sesta (Nap Time)</label>
                    <input
                      type="text"
                      value={activeChild.napTime || ''}
                      onChange={(e) => updateActiveChild('napTime', e.target.value)}
                      placeholder="Ex: 13:30 às 15:00"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sky-200 bg-sky-50/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Trocas de Fralda Hoje</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateActiveChild('diaperCount', Math.max(0, (activeChild.diaperCount || 0) - 1))}
                        className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-slate-800 flex-1 text-center bg-sky-50/50 py-1.5 rounded-lg border border-sky-100">
                        {activeChild.diaperCount || 0}
                      </span>
                      <button
                        onClick={() => updateActiveChild('diaperCount', (activeChild.diaperCount || 0) + 1)}
                        className="w-8 h-8 rounded-lg bg-sky-500 text-white font-bold text-sm shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => updateActiveChild('pottySuccess', !activeChild.pottySuccess)}
                    className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      activeChild.pottySuccess
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-sky-50/40 text-slate-600 border-sky-200'
                    }`}
                  >
                    <Baby className="w-4 h-4" />
                    <span>{activeChild.pottySuccess ? 'Uso do Banheiro Registrado ✅' : 'Registrar Sucesso no Banheiro / Desfralde'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                    <Palette className="w-4 h-4" />
                    <h2>Atividades Lúdicas de Hoje</h2>
                  </div>
                </div>

                <div className="space-y-2">
                  {(!activeChild.activities || activeChild.activities.length === 0) ? (
                    <p className="text-xs text-slate-400 py-1">Nenhuma atividade registrada hoje.</p>
                  ) : (
                    activeChild.activities.map((act) => (
                      <div key={act.id} className="p-2.5 bg-sky-50/30 border border-sky-100 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{act.title}</span>
                          <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">{act.category} • {act.duration}</span>
                        </div>
                        {act.notes && <p className="text-[11px] text-slate-500 italic">"{act.notes}"</p>}
                        <div className="flex justify-end pt-0.5">
                          <button onClick={() => handleRemoveActivity(act.id)} className="text-[10px] text-red-400 hover:underline">Remover</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-sky-50/40 border border-sky-200 rounded-xl space-y-2 pt-2">
                  <p className="text-xs font-semibold text-slate-700">Registrar Nova Brincadeira:</p>
                  <input
                    type="text"
                    value={newActTitle}
                    onChange={(e) => setNewActTitle(e.target.value)}
                    placeholder="Nome da atividade"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newActCategory}
                      onChange={(e) => setNewActCategory(e.target.value)}
                      className="px-2 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                    >
                      <option value="Artes">Artes & Pintura</option>
                      <option value="Leitura">Leitura & História</option>
                      <option value="Ar Livre">Parque & Ar Livre</option>
                      <option value="Jogos">Jogos / Peças</option>
                      <option value="Música">Música & Dança</option>
                    </select>
                    <input
                      type="text"
                      value={newActDuration}
                      onChange={(e) => setNewActDuration(e.target.value)}
                      placeholder="Duração (ex: 30 min)"
                      className="px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    value={newActNotes}
                    onChange={(e) => setNewActNotes(e.target.value)}
                    placeholder="Anotações / Reação da criança"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                  />
                  <button
                    onClick={handleAddActivity}
                    className="w-full py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg"
                  >
                    + Salvar Atividade
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                  <CalendarDays className="w-4 h-4" />
                  <h2>Agenda Semanal Recorrente</h2>
                </div>

                <div className="space-y-2">
                  {(!activeChild.weeklyEvents || activeChild.weeklyEvents.length === 0) ? (
                    <p className="text-xs text-slate-400 py-1">Nenhum compromisso fixo cadastrado.</p>
                  ) : (
                    activeChild.weeklyEvents.map((ev) => (
                      <div key={ev.id} className="flex items-center justify-between p-2.5 bg-sky-50/30 border border-sky-100 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{ev.title}</p>
                          <p className="text-[10px] text-sky-700 font-medium">📅 {ev.day} às {ev.time}</p>
                        </div>
                        <button onClick={() => handleRemoveWeeklyEvent(ev.id)} className="text-slate-300 hover:text-red-400 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-sky-50/40 border border-sky-200 rounded-xl space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Adicionar Compromisso Fixo:</p>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Compromisso (ex: Natação)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newEventDay}
                      onChange={(e) => setNewEventDay(e.target.value)}
                      className="px-2 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                    >
                      <option value="Segunda-feira">Segunda-feira</option>
                      <option value="Terça-feira">Terça-feira</option>
                      <option value="Quarta-feira">Quarta-feira</option>
                      <option value="Quinta-feira">Quinta-feira</option>
                      <option value="Sexta-feira">Sexta-feira</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                    <input
                      type="text"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      placeholder="Horário (ex: 16:00)"
                      className="px-3 py-1.5 text-xs rounded-lg border border-sky-200 bg-white"
                    />
                  </div>
                  <button
                    onClick={handleAddWeeklyEvent}
                    className="w-full py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg"
                  >
                    + Salvar Compromisso
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                  <Bus className="w-4 h-4" />
                  <h2>Escola & Transporte</h2>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Horário Saída</label>
                    <input
                      type="text"
                      value={activeChild.schoolDismissal}
                      onChange={(e) => updateActiveChild('schoolDismissal', e.target.value)}
                      placeholder="Ex: 15:30"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-sky-50/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-slate-600 block mb-1">Quem Busca / Transporte</label>
                    <input
                      type="text"
                      value={activeChild.pickupInfo}
                      onChange={(e) => updateActiveChild('pickupInfo', e.target.value)}
                      placeholder="Ex: Babá a pé"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-sky-50/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Itens da Mochila / Lembrete</label>
                  <input
                    type="text"
                    value={activeChild.bagChecklist}
                    onChange={(e) => updateActiveChild('bagChecklist', e.target.value)}
                    placeholder="Ex: Levar casaco e garrafinha"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-sky-50/20"
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                  <CheckSquare className="w-4 h-4" />
                  <h2>Checklist de Cuidados Diários</h2>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => updateActiveChild('bathDone', !activeChild.bathDone)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
                      activeChild.bathDone
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-sky-50/40 text-slate-600 border-sky-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Banho</span>
                  </button>

                  <button
                    onClick={() => updateActiveChild('homeworkDone', !activeChild.homeworkDone)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
                      activeChild.homeworkDone
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-sky-50/40 text-slate-600 border-sky-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Lição</span>
                  </button>

                  <button
                    onClick={() => updateActiveChild('screenTimeDone', !activeChild.screenTimeDone)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
                      activeChild.screenTimeDone
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-sky-50/40 text-slate-600 border-sky-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Telas OK</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                  <Clock className="w-4 h-4" />
                  <h2>Horários & Cronograma Livre</h2>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={activeChild.routine}
                    onChange={(e) => updateActiveChild('routine', e.target.value)}
                    placeholder="08:00 - Acordar&#10;12:00 - Almoço&#10;13:30 - Sesta"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-sky-50/20"
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                  <Utensils className="w-4 h-4" />
                  <h2>Alimentação do Dia</h2>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={activeChild.mealsNotes}
                    onChange={(e) => updateActiveChild('mealsNotes', e.target.value)}
                    placeholder="O que comeu, aceitação dos alimentos, lanches..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-sky-200 bg-sky-50/20 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: SEGURANÇA & EMERGÊNCIA */}
          {activeTab === 'safety' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <PhoneCall className="w-4 h-4" />
                    <h2>Discagem Rápida / Emergência</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {contacts.length === 0 ? (
                    <p className="text-xs text-slate-400 py-1">Nenhum contato de emergência cadastrado.</p>
                  ) : (
                    contacts.map((contact) => (
                      <div key={contact.id} className="flex items-center gap-2">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex-1 flex items-center justify-between p-3 bg-red-50 border border-red-200 hover:bg-red-100 rounded-xl text-red-900 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-red-600 text-white rounded-lg">
                              <PhoneCall className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold">{contact.label}</p>
                              <p className="text-[10px] text-red-600 font-mono">{contact.phone}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-lg">LIGAR</span>
                        </a>
                        <button
                          onClick={() => handleRemoveContact(contact.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-amber-100 space-y-2">
                  <p className="text-xs font-medium text-slate-600">Adicionar Novo Número:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newContactLabel}
                      onChange={(e) => setNewContactLabel(e.target.value)}
                      placeholder="Ex: Mãe, Pediatra"
                      className="px-3 py-1.5 text-xs rounded-xl border border-amber-200 bg-amber-50/20"
                    />
                    <input
                      type="text"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="Número do telefone"
                      className="px-3 py-1.5 text-xs rounded-xl border border-amber-200 bg-amber-50/20"
                    />
                  </div>
                  <button
                    onClick={handleAddContact}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Salvar Contato de Emergência</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <h2>Alergias & Restrições Graves</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allergiesList.length === 0 ? (
                    <p className="text-xs text-slate-400 py-1">Nenhuma alergia cadastrada.</p>
                  ) : (
                    allergiesList.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm"
                      >
                        <span>⚠️ {item}</span>
                        <button onClick={() => handleRemoveAllergy(item)} className="hover:text-red-200">
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Ex: Lactose, Dipirona..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-red-200 bg-red-50/20"
                  />
                  <button
                    onClick={handleAddAllergy}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <HeartPulse className="w-4 h-4" />
                  <h2>Ficha Médica & Plano de Saúde</h2>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Seguro / Plano</label>
                      <input
                        type="text"
                        value={activeChild.insuranceName || ''}
                        onChange={(e) => updateActiveChild('insuranceName', e.target.value)}
                        placeholder="Nome do plano"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-200 bg-amber-50/10"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Nº Apólice / ID</label>
                      <input
                        type="text"
                        value={activeChild.insurancePolicy || ''}
                        onChange={(e) => updateActiveChild('insurancePolicy', e.target.value)}
                        placeholder="Nº da carteirinha"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-200 bg-amber-50/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Hospital de Preferência</label>
                    <input
                      type="text"
                      value={activeChild.hospitalPreference || ''}
                      onChange={(e) => updateActiveChild('hospitalPreference', e.target.value)}
                      placeholder="Hospital de referência"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-200 bg-amber-50/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Nome do Pediatra</label>
                      <input
                        type="text"
                        value={activeChild.pediatricianName || ''}
                        onChange={(e) => updateActiveChild('pediatricianName', e.target.value)}
                        placeholder="Nome do médico"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-200 bg-amber-50/10"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Tel. Pediatra</label>
                      <input
                        type="text"
                        value={activeChild.pediatricianPhone || ''}
                        onChange={(e) => updateActiveChild('pediatricianPhone', e.target.value)}
                        placeholder="Telefone do consultório"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-200 bg-amber-50/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <Pill className="w-4 h-4" />
                  <h2>Horários de Medicações & Alarmes</h2>
                </div>

                <div className="space-y-2">
                  {medicationsList.length === 0 ? (
                    <p className="text-xs text-slate-400 py-1">Nenhum medicamento cadastrado.</p>
                  ) : (
                    medicationsList.map((med) => (
                      <div key={med.id} className="flex items-center justify-between p-3 bg-amber-50/40 border border-amber-200 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{med.name} ({med.dose})</p>
                          <p className="text-[10px] text-amber-800 font-semibold">🕒 Horário: {med.time}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAlarm(med.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                              med.alarmActive
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm animate-pulse'
                                : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                            }`}
                          >
                            {med.alarmActive ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                            <span>{med.alarmActive ? 'Alarme ON' : 'Lembrete'}</span>
                          </button>

                          <button onClick={() => handleRemoveMedication(med.id)} className="text-slate-300 hover:text-red-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                  <p className="text-xs font-medium text-slate-700">Adicionar Remédio:</p>
                  <input
                    type="text"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Nome do remédio"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newMedDose}
                      onChange={(e) => setNewMedDose(e.target.value)}
                      placeholder="Dose (ex: 5ml)"
                      className="px-3 py-1.5 text-xs rounded-lg border border-amber-200 bg-white"
                    />
                    <input
                      type="text"
                      value={newMedTime}
                      onChange={(e) => setNewMedTime(e.target.value)}
                      placeholder="Horário (ex: 14:00)"
                      className="px-3 py-1.5 text-xs rounded-lg border border-amber-200 bg-white"
                    />
                  </div>
                  <button
                    onClick={handleAddMedication}
                    className="w-full py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg"
                  >
                    Salvar Medicamento
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Home className="w-4 h-4 text-amber-600" />
                  <h2>Localização de Itens na Casa</h2>
                </div>

                <div className="space-y-2">
                  {houseLocations.length === 0 ? (
                    <p className="text-xs text-slate-400 py-1">Nenhum item cadastrado.</p>
                  ) : (
                    houseLocations.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-2.5 bg-amber-50/20 border border-amber-100 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{h.item}</p>
                          <p className="text-[11px] text-amber-900">{h.location}</p>
                        </div>
                        <button onClick={() => handleRemoveHouseLocation(h.id)} className="text-slate-300 hover:text-red-400 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-amber-50/40 border border-amber-200 rounded-xl space-y-2 pt-2">
                  <p className="text-xs font-medium text-slate-700">Cadastrar Item/Equipamento:</p>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Nome do item (ex: Primeiros Socorros)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 bg-white"
                  />
                  <input
                    type="text"
                    value={newItemLoc}
                    onChange={(e) => setNewItemLoc(e.target.value)}
                    placeholder="Onde fica na casa"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 bg-white"
                  />
                  <button
                    onClick={handleAddHouseLocation}
                    className="w-full py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg"
                  >
                    + Salvar Localização
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <h2>Visitas, Estranhos & Encomendas</h2>
                </div>

                <textarea
                  rows={3}
                  value={visitorRules}
                  onChange={(e) => setVisitorRules(e.target.value)}
                  placeholder="Instruções sobre quem pode entrar, entregas..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-amber-200 bg-amber-50/20"
                />
              </div>
            </div>
          )}

          {/* ABA 4: CENTRAL DOS PAIS */}
          {activeTab === 'parents' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <Printer className="w-4 h-4" />
                  <h2>Exportar Folha do Dia (PDF / Geladeira)</h2>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Gere um documento PDF limpo com os horários e rotina da criança.
                </p>

                <button
                  onClick={handlePrintPDF}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Gerar PDF / Imprimir Planner A4</span>
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                    <ImageIcon className="w-4 h-4" />
                    <h2>Galeria & Fotos do Dia</h2>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    {photoUrls.length} fotos
                  </span>
                </div>

                {photoUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {photoUrls.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-emerald-100">
                        <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-20 object-cover" />
                        <button
                          onClick={() => handleRemovePhotoUrl(idx)}
                          className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-md text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newPhotoInput}
                    onChange={(e) => setNewPhotoInput(e.target.value)}
                    placeholder="Link da imagem (URL da foto)"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-emerald-200 bg-emerald-50/20"
                  />
                  <button
                    onClick={handleAddPhotoUrl}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl whitespace-nowrap"
                  >
                    + Add Foto
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <ListPlus className="w-4 h-4" />
                  <h2>Lista de Reposição Categorizada</h2>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">🍎 Alimentação & Snacks</label>
                    <textarea
                      rows={1}
                      value={foodItems}
                      onChange={(e) => setFoodItems(e.target.value)}
                      placeholder="Ex: Leite, frutas..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-emerald-200 bg-emerald-50/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">🧼 Higiene & Fraldas</label>
                    <textarea
                      rows={1}
                      value={hygieneItems}
                      onChange={(e) => setHygieneItems(e.target.value)}
                      placeholder="Ex: Fraldas, lenços..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-emerald-200 bg-emerald-50/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">✏️ Escola & Atividades</label>
                    <textarea
                      rows={1}
                      value={schoolItems}
                      onChange={(e) => setSchoolItems(e.target.value)}
                      placeholder="Ex: Tinta guache, cadernos..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-emerald-200 bg-emerald-50/20 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <FileCheck className="w-4 h-4" />
                  <h2>Autorizações & Saídas Especiais</h2>
                </div>

                <div className="space-y-2">
                  {permissions.length === 0 ? (
                    <p className="text-xs text-slate-400 py-1">Nenhuma autorização pendente.</p>
                  ) : (
                    permissions.map((p) => (
                      <div key={p.id} className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{p.title}</span>
                          <button
                            onClick={() => togglePermissionApproved(p.id)}
                            className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${
                              p.approved 
                                ? 'bg-emerald-600 text-white border-emerald-600' 
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {p.approved ? 'APROVADO ✅' : 'PENDENTE ⏳'}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600">{p.details}</p>
                        <div className="flex justify-end pt-1">
                          <button onClick={() => handleRemovePermission(p.id)} className="text-[10px] text-red-400 hover:underline">Remover</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2 pt-2">
                  <p className="text-xs font-semibold text-slate-700">Solicitar Nova Autorização:</p>
                  <input
                    type="text"
                    value={newPermTitle}
                    onChange={(e) => setNewPermTitle(e.target.value)}
                    placeholder="Título da autorização"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-200 bg-white"
                  />
                  <input
                    type="text"
                    value={newPermDetails}
                    onChange={(e) => setNewPermDetails(e.target.value)}
                    placeholder="Detalhes adicionais"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-200 bg-white"
                  />
                  <button
                    onClick={handleAddPermission}
                    className="w-full py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                  >
                    + Solicitar Autorização
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <MessageSquare className="w-4 h-4" />
                  <h2>Central de Recados para os Pais</h2>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMsgType('daily')}
                    className={`p-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                      msgType === 'daily'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-emerald-50/40 text-slate-600 border-emerald-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Relatório</span>
                  </button>

                  <button
                    onClick={() => setMsgType('arrival')}
                    className={`p-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                      msgType === 'arrival'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-emerald-50/40 text-slate-600 border-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chegada</span>
                  </button>

                  <button
                    onClick={() => setMsgType('shopping')}
                    className={`p-2 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 ${
                      msgType === 'shopping'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-emerald-50/40 text-slate-600 border-emerald-100'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Reposição</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <Eye className="w-4 h-4" />
                  <h2>Pré-visualização do Texto</h2>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
                  {buildWhatsAppText()}
                </div>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(buildWhatsAppText())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </main>

        {/* Navegação Inferior Fixa */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 z-20">
          <div className="max-w-md mx-auto flex items-center justify-around">
            <button
              onClick={() => setActiveTab('aupair')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'aupair' ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Meu Espaço</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'schedule' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Cronograma</span>
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'safety' ? 'text-amber-700 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Segurança</span>
            </button>

            <button
              onClick={() => setActiveTab('parents')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'parents' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Para os Pais</span>
            </button>
          </div>
        </nav>
      </div>

    </div>
  );
}
