const fs = require('fs');

let fileContent = fs.readFileSync('worker-app/src/App.tsx', 'utf8');

// Fix imports
fileContent = fileContent.replace(
  "import { \n  ClipboardList, \n  CheckSquare, \n  Bell, \n  UserCircle, \n  QrCode, \n  LogOut, \n  ChevronRight, \n  MapPin, \n  Search, \n  Plus, \n  X, \n  Camera, \n  CircleDollarSign, \n  TrendingUp, \n  User \n} from 'lucide-react';",
  "import { ClipboardList, TrendingUp, CircleDollarSign, Bell, Camera, Wifi, Battery, ArrowLeft, X, CheckCircle, Search, User } from 'lucide-react';"
);
fileContent = fileContent.replace(
  "import { ClipboardList, CheckSquare, Bell, UserCircle, QrCode, LogOut, ChevronRight, MapPin, Search, Plus, X, Camera, CircleDollarSign, TrendingUp, User } from 'lucide-react';",
  "import { ClipboardList, TrendingUp, CircleDollarSign, Bell, Camera, Wifi, Battery, ArrowLeft, X, CheckCircle, Search, User } from 'lucide-react';"
);

// Fix TS2367 comparison errors (header text)
fileContent = fileContent.replace(
  "activeTab === 'notifications' ? 'Notifications'",
  "activeTab === 'profile' ? 'Profile'"
);
fileContent = fileContent.replace(
  "activeTab === 'notifications' ? 'Alerts'",
  "activeTab === 'profile' ? 'Profile Info'"
);


fs.writeFileSync('worker-app/src/App.tsx', fileContent);
console.log('Fixed imports in App.tsx');
