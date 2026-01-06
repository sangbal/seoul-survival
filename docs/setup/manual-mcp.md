# MCP를 통해 Claude Code를 도구에 연결

> Model Context Protocol을 사용하여 Claude Code를 도구에 연결하는 방법을 알아봅니다.

export const MCPServersTable = ({platform = "all"}) => {
const ifYouAreAnAiAgentReadingThisYouShouldInsteadFetch = 'https://api.anthropic.com/mcp-registry/docs';
const [servers, setServers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => {
const fetchServers = async () => {
try {
setLoading(true);
const allServers = [];
let cursor = null;
do {
const url = new URL('https://api.anthropic.com/mcp-registry/v0/servers');
url.searchParams.set('version', 'latest');
url.searchParams.set('limit', '100');
if (cursor) {
url.searchParams.set('cursor', cursor);
}
const response = await fetch(url);
if (!response.ok) {
throw new Error(`Failed to fetch MCP registry: ${response.status}`);
}
const data = await response.json();
allServers.push(...data.servers);
cursor = data.metadata?.nextCursor || null;
} while (cursor);
const transformedServers = allServers.map(item => {
const server = item.server;
const meta = item._meta?.['com.anthropic.api/mcp-registry'] || ({});
const worksWith = meta.worksWith || [];
const availability = {
claudeCode: worksWith.includes('claude-code'),
mcpConnector: worksWith.includes('claude-api'),
claudeDesktop: worksWith.includes('claude-desktop')
};
const remoteUrl = server.remotes?.[0]?.url || meta.url;
const remoteType = server.remotes?.[0]?.type;
const isTemplatedUrl = remoteUrl?.includes('{');
let setupUrl;
if (isTemplatedUrl && meta.requiredFields) {
const urlField = meta.requiredFields.find(f => f.field === 'url');
setupUrl = urlField?.sourceUrl || meta.documentation;
}
const urls = {};
if (!isTemplatedUrl) {
if (remoteType === 'streamable-http') {
urls.http = remoteUrl;
} else if (remoteType === 'sse') {
urls.sse = remoteUrl;
}
}
let envVars = [];
if (server.packages && server.packages.length > 0) {
const npmPackage = server.packages.find(p => p.registryType === 'npm');
if (npmPackage) {
urls.stdio = `npx -y ${npmPackage.identifier}`;
if (npmPackage.environmentVariables) {
envVars = npmPackage.environmentVariables;
}
}
}
return {
name: meta.displayName || server.title || server.name,
description: meta.oneLiner || server.description,
documentation: meta.documentation,
urls: urls,
envVars: envVars,
availability: availability,
customCommands: meta.claudeCodeCopyText ? {
claudeCode: meta.claudeCodeCopyText
} : undefined,
setupUrl: setupUrl
};
});
setServers(transformedServers);
setError(null);
} catch (err) {
setError(err.message);
console.error('Error fetching MCP registry:', err);
} finally {
setLoading(false);
}
};
fetchServers();
}, []);
const generateClaudeCodeCommand = server => {
if (server.customCommands && server.customCommands.claudeCode) {
return server.customCommands.claudeCode;
}
const serverSlug = server.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
if (server.urls.http) {
return `claude mcp add ${serverSlug} --transport http ${server.urls.http}`;
}
if (server.urls.sse) {
return `claude mcp add ${serverSlug} --transport sse ${server.urls.sse}`;
}
if (server.urls.stdio) {
const envFlags = server.envVars && server.envVars.length > 0 ? server.envVars.map(v => `--env ${v.name}=YOUR_${v.name}`).join(' ') : '';
      const baseCommand = `claude mcp add ${serverSlug} --transport stdio`;
      return envFlags ? `${baseCommand} ${envFlags} -- ${server.urls.stdio}` : `${baseCommand} -- ${server.urls.stdio}`;
    }
    return null;
  };
  if (loading) {
    return <div>Loading MCP servers...</div>;
  }
  if (error) {
    return <div>Error loading MCP servers: {error}</div>;
  }
  const filteredServers = servers.filter(server => {
    if (platform === "claudeCode") {
      return server.availability.claudeCode;
    } else if (platform === "mcpConnector") {
      return server.availability.mcpConnector;
    } else if (platform === "claudeDesktop") {
      return server.availability.claudeDesktop;
    } else if (platform === "all") {
      return true;
    } else {
      throw new Error(`Unknown platform: ${platform}`);
    }
  });
  return <>
      <style jsx>{`
.cards-container {
display: grid;
gap: 1rem;
margin-bottom: 2rem;
}
.server-card {
border: 1px solid var(--border-color, #e5e7eb);
border-radius: 6px;
padding: 1rem;
}
.command-row {
display: flex;
align-items: center;
gap: 0.25rem;
}
.command-row code {
font-size: 0.75rem;
overflow-x: auto;
}
`}</style>

      <div className="cards-container">
        {filteredServers.map(server => {
    const claudeCodeCommand = generateClaudeCodeCommand(server);
    const mcpUrl = server.urls.http || server.urls.sse;
    const commandToShow = platform === "claudeCode" ? claudeCodeCommand : mcpUrl;
    return <div key={server.name} className="server-card">
              <div>
                {server.documentation ? <a href={server.documentation}>
                    <strong>{server.name}</strong>
                  </a> : <strong>{server.name}</strong>}
              </div>

              <p style={{
      margin: '0.5rem 0',
      fontSize: '0.9rem'
    }}>
                {server.description}
              </p>

              {server.setupUrl && <p style={{
      margin: '0.25rem 0',
      fontSize: '0.8rem',
      fontStyle: 'italic',
      opacity: 0.7
    }}>
                  Requires user-specific URL.{' '}
                  <a href={server.setupUrl} style={{
      textDecoration: 'underline'
    }}>
                    Get your URL here
                  </a>.
                </p>}

              {commandToShow && !server.setupUrl && <>
                <p style={{
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: 500,
      minWidth: 'fit-content',
      marginTop: '0.5rem',
      marginBottom: 0
    }}>
                  {platform === "claudeCode" ? "Command" : "URL"}
                </p>
                <div className="command-row">
                  <code>
                    {commandToShow}
                  </code>
                </div>
              </>}
            </div>;

})}
</div>
</>;
};

Claude Code는 AI 도구 통합을 위한 오픈소스 표준인 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)를 통해 수백 개의 외부 도구 및 데이터 소스에 연결할 수 있습니다. MCP 서버는 Claude Code에 도구, 데이터베이스 및 API에 대한 액세스를 제공합니다.

## MCP로 할 수 있는 것

MCP 서버가 연결되면 Claude Code에 다음을 요청할 수 있습니다:

- **이슈 추적기에서 기능 구현**: "JIRA 이슈 ENG-4521에 설명된 기능을 추가하고 GitHub에서 PR을 생성하세요."
- **모니터링 데이터 분석**: "Sentry와 Statsig을 확인하여 ENG-4521에 설명된 기능의 사용 현황을 확인하세요."
- **데이터베이스 쿼리**: "Postgres 데이터베이스를 기반으로 기능 ENG-4521을 사용한 무작위 사용자 10명의 이메일을 찾으세요."
- **디자인 통합**: "Slack에 게시된 새로운 Figma 디자인을 기반으로 표준 이메일 템플릿을 업데이트하세요."
- **워크플로우 자동화**: "이 10명의 사용자를 새로운 기능에 대한 피드백 세션에 초대하는 Gmail 초안을 작성하세요."

## 인기 있는 MCP 서버

Claude Code에 연결할 수 있는 일반적으로 사용되는 MCP 서버는 다음과 같습니다:

<Warning>
  타사 MCP 서버를 사용할 때는 자신의 책임하에 사용하세요 - Anthropic은 이러한 모든 서버의 정확성이나 보안을 검증하지 않았습니다.
  설치하는 MCP 서버를 신뢰할 수 있는지 확인하세요.
  신뢰할 수 없는 콘텐츠를 가져올 수 있는 MCP 서버를 사용할 때는 특히 주의하세요. 이러한 서버는 프롬프트 주입 위험에 노출될 수 있습니다.
</Warning>

<MCPServersTable platform="claudeCode" />

<Note>
  **특정 통합이 필요하신가요?** [GitHub에서 수백 개의 MCP 서버를 찾거나](https://github.com/modelcontextprotocol/servers) [MCP SDK](https://modelcontextprotocol.io/quickstart/server)를 사용하여 자신만의 서버를 구축하세요.
</Note>

## MCP 서버 설치

MCP 서버는 필요에 따라 세 가지 다른 방식으로 구성할 수 있습니다:

### 옵션 1: 원격 HTTP 서버 추가

HTTP 서버는 원격 MCP 서버에 연결하기 위한 권장 옵션입니다. 이는 클라우드 기반 서비스에 대해 가장 널리 지원되는 전송 방식입니다.

```bash theme={null}
# 기본 구문
claude mcp add --transport http <name> <url>

# 실제 예: Notion에 연결
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Bearer 토큰을 사용한 예
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### 옵션 2: 원격 SSE 서버 추가

<Warning>
  SSE (Server-Sent Events) 전송은 더 이상 사용되지 않습니다. 가능한 경우 HTTP 서버를 대신 사용하세요.
</Warning>

```bash theme={null}
# 기본 구문
claude mcp add --transport sse <name> <url>

# 실제 예: Asana에 연결
claude mcp add --transport sse asana https://mcp.asana.com/sse

# 인증 헤더를 사용한 예
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### 옵션 3: 로컬 stdio 서버 추가

Stdio 서버는 컴퓨터에서 로컬 프로세스로 실행됩니다. 직접 시스템 액세스가 필요하거나 사용자 정의 스크립트가 필요한 도구에 이상적입니다.

```bash theme={null}
# 기본 구문
claude mcp add --transport stdio <name> <command> [args...]

# 실제 예: Airtable 서버 추가
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

<Note>
  **"--" 매개변수 이해:**
  `--` (이중 대시)는 Claude의 자체 CLI 플래그를 MCP 서버에 전달되는 명령 및 인수와 구분합니다. `--` 앞의 모든 것은 Claude의 옵션(`--env`, `--scope` 등)이고, `--` 뒤의 모든 것은 MCP 서버를 실행하는 실제 명령입니다.

예를 들어:

- `claude mcp add --transport stdio myserver -- npx server` → `npx server` 실행
- `claude mcp add --transport stdio myserver --env KEY=value -- python server.py --port 8080` → 환경에서 `KEY=value`를 사용하여 `python server.py --port 8080` 실행

이는 Claude의 플래그와 서버의 플래그 간의 충돌을 방지합니다.
</Note>

### 서버 관리

구성한 후에는 다음 명령으로 MCP 서버를 관리할 수 있습니다:

```bash theme={null}
# 구성된 모든 서버 나열
claude mcp list

# 특정 서버의 세부 정보 가져오기
claude mcp get github

# 서버 제거
claude mcp remove github

# (Claude Code 내에서) 서버 상태 확인
/mcp
```

<Tip>
  팁:

- `--scope` 플래그를 사용하여 구성이 저장되는 위치를 지정하세요:
  - `local` (기본값): 현재 프로젝트에서만 사용 가능 (이전 버전에서는 `project`라고 불렸음)
  - `project`: `.mcp.json` 파일을 통해 프로젝트의 모든 사람과 공유
  - `user`: 모든 프로젝트에서 사용 가능 (이전 버전에서는 `global`이라고 불렸음)
- `--env` 플래그로 환경 변수 설정 (예: `--env KEY=value`)
- MCP_TIMEOUT 환경 변수를 사용하여 MCP 서버 시작 시간 초과 구성 (예: `MCP_TIMEOUT=10000 claude`는 10초 시간 초과 설정)
- Claude Code는 MCP 도구 출력이 10,000 토큰을 초과할 때 경고를 표시합니다. 이 제한을 늘리려면 `MAX_MCP_OUTPUT_TOKENS` 환경 변수를 설정하세요 (예: `MAX_MCP_OUTPUT_TOKENS=50000`)
- `/mcp`를 사용하여 OAuth 2.0 인증이 필요한 원격 서버로 인증
  </Tip>

<Warning>
  **Windows 사용자**: 네이티브 Windows (WSL 아님)에서 `npx`를 사용하는 로컬 MCP 서버는 올바른 실행을 보장하기 위해 `cmd /c` 래퍼가 필요합니다.

```bash theme={null}
# 이는 Windows가 실행할 수 있는 command="cmd"를 생성합니다
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

`cmd /c` 래퍼 없이는 Windows가 `npx`를 직접 실행할 수 없기 때문에 "Connection closed" 오류가 발생합니다. (위의 참고 사항에서 `--` 매개변수에 대한 설명을 참조하세요.)
</Warning>

### 플러그인 제공 MCP 서버

[플러그인](/ko/plugins)은 MCP 서버를 번들로 제공할 수 있으며, 플러그인이 활성화될 때 도구 및 통합을 자동으로 제공합니다. 플러그인 MCP 서버는 사용자 구성 서버와 동일하게 작동합니다.

**플러그인 MCP 서버 작동 방식**:

- 플러그인은 플러그인 루트의 `.mcp.json` 또는 `plugin.json`에 인라인으로 MCP 서버를 정의합니다
- 플러그인이 활성화되면 MCP 서버가 자동으로 시작됩니다
- 플러그인 MCP 도구는 수동으로 구성된 MCP 도구와 함께 나타납니다
- 플러그인 서버는 플러그인 설치를 통해 관리됩니다 (`/mcp` 명령이 아님)

**플러그인 MCP 구성 예**:

플러그인 루트의 `.mcp.json`:

```json theme={null}
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

또는 `plugin.json`에 인라인:

```json theme={null}
{
  "name": "my-plugin",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

**플러그인 MCP 기능**:

- **자동 생명주기**: 플러그인이 활성화될 때 서버가 시작되지만, MCP 서버 변경 사항을 적용하려면 Claude Code를 다시 시작해야 합니다 (활성화 또는 비활성화)
- **환경 변수**: 플러그인 상대 경로에 `${CLAUDE_PLUGIN_ROOT}` 사용
- **사용자 환경 액세스**: 수동으로 구성된 서버와 동일한 환경 변수에 액세스
- **여러 전송 유형**: stdio, SSE 및 HTTP 전송 지원 (전송 지원은 서버에 따라 다를 수 있음)

**플러그인 MCP 서버 보기**:

```bash theme={null}
# Claude Code 내에서 플러그인 서버를 포함한 모든 MCP 서버 보기
/mcp
```

플러그인 서버는 플러그인에서 제공됨을 나타내는 표시기와 함께 목록에 나타납니다.

**플러그인 MCP 서버의 이점**:

- **번들 배포**: 도구 및 서버가 함께 패키징됨
- **자동 설정**: 수동 MCP 구성이 필요 없음
- **팀 일관성**: 플러그인이 설치될 때 모든 사람이 동일한 도구를 받음

플러그인과 함께 MCP 서버를 번들로 제공하는 방법에 대한 자세한 내용은 [플러그인 구성 요소 참조](/ko/plugins-reference#mcp-servers)를 참조하세요.

## MCP 설치 범위

MCP 서버는 세 가지 다른 범위 수준에서 구성할 수 있으며, 각각은 서버 접근성 및 공유 관리를 위한 서로 다른 목적을 제공합니다. 이러한 범위를 이해하면 특정 요구 사항에 맞게 서버를 구성하는 최선의 방법을 결정하는 데 도움이 됩니다.

### 로컬 범위

로컬 범위 서버는 기본 구성 수준을 나타내며 프로젝트별 사용자 설정에 저장됩니다. 이러한 서버는 사용자에게만 비공개이며 현재 프로젝트 디렉토리 내에서 작업할 때만 액세스할 수 있습니다. 이 범위는 개인 개발 서버, 실험적 구성 또는 공유하면 안 되는 민감한 자격 증명을 포함하는 서버에 이상적입니다.

```bash theme={null}
# 로컬 범위 서버 추가 (기본값)
claude mcp add --transport http stripe https://mcp.stripe.com

# 명시적으로 로컬 범위 지정
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### 프로젝트 범위

프로젝트 범위 서버는 프로젝트 루트 디렉토리의 `.mcp.json` 파일에 구성을 저장하여 팀 협업을 가능하게 합니다. 이 파일은 버전 관리에 체크인되도록 설계되어 모든 팀 멤버가 동일한 MCP 도구 및 서비스에 액세스할 수 있도록 합니다. 프로젝트 범위 서버를 추가하면 Claude Code는 자동으로 이 파일을 생성하거나 적절한 구성 구조로 업데이트합니다.

```bash theme={null}
# 프로젝트 범위 서버 추가
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

결과 `.mcp.json` 파일은 표준화된 형식을 따릅니다:

```json theme={null}
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

보안상의 이유로 Claude Code는 `.mcp.json` 파일에서 프로젝트 범위 서버를 사용하기 전에 승인을 요청합니다. 이러한 승인 선택을 재설정해야 하는 경우 `claude mcp reset-project-choices` 명령을 사용하세요.

### 사용자 범위

사용자 범위 서버는 크로스 프로젝트 접근성을 제공하여 컴퓨터의 모든 프로젝트에서 사용 가능하면서 사용자 계정에만 비공개로 유지됩니다. 이 범위는 개인 유틸리티 서버, 개발 도구 또는 다양한 프로젝트에서 자주 사용하는 서비스에 적합합니다.

```bash theme={null}
# 사용자 서버 추가
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### 올바른 범위 선택

다음을 기반으로 범위를 선택하세요:

- **로컬 범위**: 개인 서버, 실험적 구성 또는 한 프로젝트에만 해당하는 민감한 자격 증명
- **프로젝트 범위**: 팀 공유 서버, 프로젝트별 도구 또는 협업에 필요한 서비스
- **사용자 범위**: 여러 프로젝트에서 필요한 개인 유틸리티, 개발 도구 또는 자주 사용하는 서비스

### 범위 계층 및 우선순위

MCP 서버 구성은 명확한 우선순위 계층을 따릅니다. 여러 범위에 동일한 이름의 서버가 있을 때 시스템은 로컬 범위 서버를 먼저 우선순위로 지정하고, 그 다음 프로젝트 범위 서버, 마지막으로 사용자 범위 서버를 우선순위로 지정하여 충돌을 해결합니다. 이 설계는 필요할 때 개인 구성이 공유 구성을 재정의할 수 있도록 합니다.

### `.mcp.json`의 환경 변수 확장

Claude Code는 `.mcp.json` 파일의 환경 변수 확장을 지원하여 팀이 구성을 공유하면서 머신별 경로 및 API 키와 같은 민감한 값에 대한 유연성을 유지할 수 있습니다.

**지원되는 구문:**

- `${VAR}` - 환경 변수 `VAR`의 값으로 확장
- `${VAR:-default}` - `VAR`이 설정된 경우 `VAR`로 확장, 그렇지 않으면 `default` 사용

**확장 위치:**
환경 변수는 다음에서 확장할 수 있습니다:

- `command` - 서버 실행 파일 경로
- `args` - 명령줄 인수
- `env` - 서버에 전달되는 환경 변수
- `url` - HTTP 서버 유형의 경우
- `headers` - HTTP 서버 인증의 경우

**변수 확장을 사용한 예**:

```json theme={null}
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

필수 환경 변수가 설정되지 않았고 기본값이 없으면 Claude Code는 구성을 구문 분석하지 못합니다.

## 실제 예

{/\* ### 예: Playwright로 브라우저 테스트 자동화

````bash
# 1. Playwright MCP 서버 추가
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest

# 2. 브라우저 테스트 작성 및 실행
> "test@example.com으로 로그인 흐름이 작동하는지 테스트"
> "모바일에서 체크아웃 페이지의 스크린샷 촬영"
> "검색 기능이 결과를 반환하는지 확인"
``` */}

### 예: Sentry로 오류 모니터링

```bash  theme={null}
# 1. Sentry MCP 서버 추가
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. /mcp를 사용하여 Sentry 계정으로 인증
> /mcp

# 3. 프로덕션 문제 디버깅
> "지난 24시간 동안 가장 일반적인 오류는 무엇입니까?"
> "오류 ID abc123의 스택 추적을 보여주세요"
> "어떤 배포가 이러한 새로운 오류를 도입했습니까?"
````

### 예: 코드 검토를 위해 GitHub에 연결

```bash theme={null}
# 1. GitHub MCP 서버 추가
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. Claude Code에서 필요한 경우 인증
> /mcp
# GitHub에 대해 "Authenticate" 선택

# 3. 이제 Claude에 GitHub로 작업하도록 요청할 수 있습니다
> "PR #456을 검토하고 개선 사항을 제안하세요"
> "방금 발견한 버그에 대한 새 이슈를 생성하세요"
> "내게 할당된 모든 열린 PR을 보여주세요"
```

### 예: PostgreSQL 데이터베이스 쿼리

```bash theme={null}
# 1. 연결 문자열을 사용하여 데이터베이스 서버 추가
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"

# 2. 자연스럽게 데이터베이스 쿼리
> "이번 달 총 수익은 얼마입니까?"
> "주문 테이블의 스키마를 보여주세요"
> "지난 90일 동안 구매하지 않은 고객을 찾으세요"
```

## 원격 MCP 서버로 인증

많은 클라우드 기반 MCP 서버는 인증이 필요합니다. Claude Code는 보안 연결을 위해 OAuth 2.0을 지원합니다.

<Steps>
  <Step title="인증이 필요한 서버 추가">
    예를 들어:

    ```bash  theme={null}
    claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
    ```

  </Step>

  <Step title="Claude Code 내에서 /mcp 명령 사용">
    Claude Code에서 다음 명령을 사용하세요:

    ```
    > /mcp
    ```

    그런 다음 브라우저에서 로그인 단계를 따르세요.

  </Step>
</Steps>

<Tip>
  팁:

- 인증 토큰은 안전하게 저장되고 자동으로 새로 고쳐집니다
- `/mcp` 메뉴에서 "Clear authentication"을 사용하여 액세스 취소
- 브라우저가 자동으로 열리지 않으면 제공된 URL을 복사하세요
- OAuth 인증은 HTTP 서버에서 작동합니다
  </Tip>

## JSON 구성에서 MCP 서버 추가

MCP 서버에 대한 JSON 구성이 있는 경우 직접 추가할 수 있습니다:

<Steps>
  <Step title="JSON에서 MCP 서버 추가">
    ```bash  theme={null}
    # 기본 구문
    claude mcp add-json <name> '<json>'

    # 예: JSON 구성을 사용하여 HTTP 서버 추가
    claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

    # 예: JSON 구성을 사용하여 stdio 서버 추가
    claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
    ```

  </Step>

  <Step title="서버가 추가되었는지 확인">
    ```bash  theme={null}
    claude mcp get weather-api
    ```
  </Step>
</Steps>

<Tip>
  팁:

- JSON이 셸에서 올바르게 이스케이프되었는지 확인하세요
- JSON은 MCP 서버 구성 스키마를 준수해야 합니다
- `--scope user`를 사용하여 프로젝트별 구성 대신 사용자 구성에 서버를 추가할 수 있습니다
  </Tip>

## Claude Desktop에서 MCP 서버 가져오기

Claude Desktop에서 이미 MCP 서버를 구성한 경우 가져올 수 있습니다:

<Steps>
  <Step title="Claude Desktop에서 서버 가져오기">
    ```bash  theme={null}
    # 기본 구문 
    claude mcp add-from-claude-desktop 
    ```
  </Step>

  <Step title="가져올 서버 선택">
    명령을 실행한 후 가져올 서버를 선택할 수 있는 대화형 대화 상자가 표시됩니다.
  </Step>

  <Step title="서버가 가져와졌는지 확인">
    ```bash  theme={null}
    claude mcp list 
    ```
  </Step>
</Steps>

<Tip>
  팁:

- 이 기능은 macOS 및 Windows Subsystem for Linux (WSL)에서만 작동합니다
- 이러한 플랫폼의 표준 위치에서 Claude Desktop 구성 파일을 읽습니다
- `--scope user` 플래그를 사용하여 사용자 구성에 서버를 추가하세요
- 가져온 서버는 Claude Desktop과 동일한 이름을 갖습니다
- 동일한 이름의 서버가 이미 있으면 숫자 접미사가 붙습니다 (예: `server_1`)
  </Tip>

## Claude Code를 MCP 서버로 사용

Claude Code 자체를 다른 애플리케이션이 연결할 수 있는 MCP 서버로 사용할 수 있습니다:

```bash theme={null}
# Claude를 stdio MCP 서버로 시작
claude mcp serve
```

Claude Desktop에서 이를 사용하려면 claude_desktop_config.json에 다음 구성을 추가하세요:

```json theme={null}
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

<Tip>
  팁:

- 서버는 View, Edit, LS 등과 같은 Claude의 도구에 대한 액세스를 제공합니다
- Claude Desktop에서 Claude에 디렉토리의 파일을 읽고, 편집을 수행하는 등을 요청해 보세요
- 이 MCP 서버는 단순히 Claude Code의 도구를 MCP 클라이언트에 노출하므로 자신의 클라이언트는 개별 도구 호출에 대한 사용자 확인을 구현할 책임이 있습니다
  </Tip>

## MCP 출력 제한 및 경고

MCP 도구가 큰 출력을 생성할 때 Claude Code는 토큰 사용을 관리하여 대화 컨텍스트가 압도되지 않도록 합니다:

- **출력 경고 임계값**: Claude Code는 MCP 도구 출력이 10,000 토큰을 초과할 때 경고를 표시합니다
- **구성 가능한 제한**: `MAX_MCP_OUTPUT_TOKENS` 환경 변수를 사용하여 최대 허용 MCP 출력 토큰을 조정할 수 있습니다
- **기본 제한**: 기본 최대값은 25,000 토큰입니다

큰 출력을 생성하는 도구의 제한을 늘리려면:

```bash theme={null}
# MCP 도구 출력의 제한을 높게 설정
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

이는 다음을 수행하는 MCP 서버로 작업할 때 특히 유용합니다:

- 대규모 데이터 세트 또는 데이터베이스 쿼리
- 상세한 보고서 또는 문서 생성
- 광범위한 로그 파일 또는 디버깅 정보 처리

<Warning>
  특정 MCP 서버에서 출력 경고가 자주 발생하는 경우 제한을 늘리거나 서버를 구성하여 응답을 페이지 매김하거나 필터링하는 것을 고려하세요.
</Warning>

## MCP 리소스 사용

MCP 서버는 파일을 참조하는 방식과 유사하게 @ 멘션을 사용하여 참조할 수 있는 리소스를 노출할 수 있습니다.

### MCP 리소스 참조

<Steps>
  <Step title="사용 가능한 리소스 나열">
    프롬프트에 `@`를 입력하여 연결된 모든 MCP 서버에서 사용 가능한 리소스를 확인하세요. 리소스는 자동 완성 메뉴에서 파일과 함께 나타납니다.
  </Step>

  <Step title="특정 리소스 참조">
    `@server:protocol://resource/path` 형식을 사용하여 리소스를 참조하세요:

    ```
    > @github:issue://123을 분석하고 수정 사항을 제안해 주시겠어요?
    ```

    ```
    > @docs:file://api/authentication의 API 문서를 검토해 주세요
    ```

  </Step>

  <Step title="여러 리소스 참조">
    단일 프롬프트에서 여러 리소스를 참조할 수 있습니다:

    ```
    > @postgres:schema://users와 @docs:file://database/user-model을 비교해 주세요
    ```

  </Step>
</Steps>

<Tip>
  팁:

- 리소스는 참조될 때 자동으로 가져와지고 첨부 파일로 포함됩니다
- 리소스 경로는 @ 멘션 자동 완성에서 퍼지 검색 가능합니다
- Claude Code는 서버가 지원할 때 MCP 리소스를 나열하고 읽을 수 있는 도구를 자동으로 제공합니다
- 리소스는 MCP 서버가 제공하는 모든 유형의 콘텐츠를 포함할 수 있습니다 (텍스트, JSON, 구조화된 데이터 등)
  </Tip>

## MCP 프롬프트를 슬래시 명령으로 사용

MCP 서버는 Claude Code에서 슬래시 명령으로 사용 가능하게 되는 프롬프트를 노출할 수 있습니다.

### MCP 프롬프트 실행

<Steps>
  <Step title="사용 가능한 프롬프트 검색">
    `/`를 입력하여 MCP 서버의 프롬프트를 포함한 모든 사용 가능한 명령을 확인하세요. MCP 프롬프트는 `/mcp__servername__promptname` 형식으로 나타납니다.
  </Step>

  <Step title="인수 없이 프롬프트 실행">
    ```
    > /mcp__github__list_prs
    ```
  </Step>

  <Step title="인수를 사용하여 프롬프트 실행">
    많은 프롬프트는 인수를 허용합니다. 명령 뒤에 공백으로 구분된 인수를 전달하세요:

    ```
    > /mcp__github__pr_review 456
    ```

    ```
    > /mcp__jira__create_issue "로그인 흐름의 버그" high
    ```

  </Step>
</Steps>

<Tip>
  팁:

- MCP 프롬프트는 연결된 서버에서 동적으로 검색됩니다
- 인수는 프롬프트의 정의된 매개변수를 기반으로 구문 분석됩니다
- 프롬프트 결과는 대화에 직접 주입됩니다
- 서버 및 프롬프트 이름은 정규화됩니다 (공백은 밑줄이 됨)
  </Tip>

## 엔터프라이즈 MCP 구성

MCP 서버에 대한 중앙 집중식 제어가 필요한 조직의 경우 Claude Code는 엔터프라이즈 관리 MCP 구성을 지원합니다. 이를 통해 IT 관리자는 다음을 수행할 수 있습니다:

- **직원이 액세스할 수 있는 MCP 서버 제어**: 조직 전체에 승인된 MCP 서버의 표준화된 집합 배포
- **승인되지 않은 MCP 서버 방지**: 선택적으로 사용자가 자신의 MCP 서버를 추가하지 못하도록 제한
- **MCP 완전히 비활성화**: 필요한 경우 MCP 기능을 완전히 제거

### 엔터프라이즈 MCP 구성 설정

시스템 관리자는 관리되는 설정 파일과 함께 엔터프라이즈 MCP 구성 파일을 배포할 수 있습니다:

- **macOS**: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- **Windows**: `C:\ProgramData\ClaudeCode\managed-mcp.json`
- **Linux**: `/etc/claude-code/managed-mcp.json`

`managed-mcp.json` 파일은 표준 `.mcp.json` 파일과 동일한 형식을 사용합니다:

```json theme={null}
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

### 허용 목록 및 거부 목록으로 MCP 서버 제한

엔터프라이즈 관리 서버를 제공하는 것 외에도 관리자는 `managed-settings.json` 파일의 `allowedMcpServers` 및 `deniedMcpServers`를 사용하여 사용자가 구성할 수 있는 MCP 서버를 제어할 수 있습니다:

- **macOS**: `/Library/Application Support/ClaudeCode/managed-settings.json`
- **Windows**: `C:\ProgramData\ClaudeCode\managed-settings.json`
- **Linux**: `/etc/claude-code/managed-settings.json`

```json theme={null}
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "sentry" },
    { "serverName": "company-internal" }
  ],
  "deniedMcpServers": [{ "serverName": "filesystem" }]
}
```

**허용 목록 동작 (`allowedMcpServers`)**:

- `undefined` (기본값): 제한 없음 - 사용자는 모든 MCP 서버를 구성할 수 있습니다
- 빈 배열 `[]`: 완전한 잠금 - 사용자는 MCP 서버를 구성할 수 없습니다
- 서버 이름 목록: 사용자는 지정된 서버만 구성할 수 있습니다

**거부 목록 동작 (`deniedMcpServers`)**:

- `undefined` (기본값): 차단된 서버 없음
- 빈 배열 `[]`: 차단된 서버 없음
- 서버 이름 목록: 지정된 서버는 모든 범위에서 명시적으로 차단됩니다

**중요 참고 사항**:

- 이러한 제한은 모든 범위에 적용됩니다: 사용자, 프로젝트, 로컬 및 `managed-mcp.json`의 엔터프라이즈 서버
- **거부 목록이 절대 우선순위**: 서버가 두 목록에 모두 나타나면 차단됩니다

<Note>
  **엔터프라이즈 구성 우선순위**: 엔터프라이즈 MCP 구성은 최고 우선순위를 가지며 `useEnterpriseMcpConfigOnly`가 활성화되면 사용자, 로컬 또는 프로젝트 구성으로 재정의할 수 없습니다.
</Note>

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://code.claude.com/docs/llms.txt
