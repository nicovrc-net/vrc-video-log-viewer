import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Switch, FormControlLabel } from '@mui/material';

// window.api の型定義
declare global {
  interface Window {
    api: {
      loadConfig: () => Promise<any>;
      watchLogs: (folder: string, filters: LogFilters) => Promise<any>;
      onNewLogs: (callback: (logs: LogData[]) => void) => void;
    };
  }
}

// ログデータの型
type LogData = {
  time: string;
  url: string;
  type: 'Video' | 'Image' | 'String';
};

// フィルター型
type LogFilters = {
  Video: boolean;
  Image: boolean;
  String: boolean;
};

// 設定型
type Config = {
  logfolder?: string;
  debugOutput?: boolean;
  oldLogCheck?: boolean;
  VideoPlayer?: boolean;
  ImageDownloader?: boolean;
  StringDownloader?: boolean;
  error?: string;
};

export default function App() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [config, setConfig] = useState<Config>({});
  const [filters, setFilters] = useState<LogFilters>({
    Video: true,
    Image: true,
    String: true,
  });

  useEffect(() => {
    window.api.loadConfig().then((cfg) => {
      setConfig(cfg);
      if (cfg?.logfolder) {
        window.api.watchLogs(cfg.logfolder, filters);
      }
    });

    window.api.onNewLogs((newLogs: LogData[]) => {
      setLogs((prev) => [...prev, ...newLogs]);
    });
  }, [filters]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">VRC Video Log Viewer</Typography>

      {config?.error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {config.error}
        </Typography>
      ) : (
        <>
          <Typography sx={{ mt: 1 }}>
            ログフォルダ: {config?.logfolder || '(未設定)'}
          </Typography>
          <div>
            {(['Video', 'Image', 'String'] as const).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Switch
                    checked={filters[key]}
                    onChange={() =>
                      setFilters({ ...filters, [key]: !filters[key] })
                    }
                  />
                }
                label={key}
              />
            ))}
          </div>
        </>
      )}

      <List
        sx={{
          mt: 3,
          maxHeight: 500,
          overflow: 'auto',
          bgcolor: '#111',
          color: '#fff',
        }}
      >
        {logs.map((log, idx) => (
          <ListItem key={idx} divider>
            <ListItemText
              primary={`${log.time} ${log.url}`}
              secondary={`(${log.type})`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
