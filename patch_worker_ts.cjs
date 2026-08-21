const fs = require('fs');

let fileContent = fs.readFileSync('worker-app/src/App.tsx', 'utf8');

// 1. Add User to imports
fileContent = fileContent.replace(
  "import { ClipboardList, CheckSquare, Bell, UserCircle, QrCode, LogOut, ChevronRight, MapPin, Search, Plus, X, Camera, CircleDollarSign, TrendingUp } from 'lucide-react';",
  "import { ClipboardList, CheckSquare, Bell, UserCircle, QrCode, LogOut, ChevronRight, MapPin, Search, Plus, X, Camera, CircleDollarSign, TrendingUp, User } from 'lucide-react';"
);

// 2. Fix activeTab state type
fileContent = fileContent.replace(
  "const [activeTab, setActiveTab] = useState<'tasks' | 'log_output' | 'earnings' | 'notifications'>('tasks');",
  "const [activeTab, setActiveTab] = useState<'tasks' | 'log_output' | 'earnings' | 'profile'>('tasks');"
);

fs.writeFileSync('worker-app/src/App.tsx', fileContent);
console.log('Fixed TS errors in worker-app App.tsx');
