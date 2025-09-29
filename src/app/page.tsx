'use client';

import { useState, FormEvent, ChangeEvent, ReactNode } from 'react';
import { supabase } from '../utils/supabase';

type HelpfulAIFeatures = string[];

const departmentOptions = [
  '글로벌 전시본부',
  '글로벌 비즈본부',
  '기획행사실',
  '크리에이티브실 / 디자인 연구소',
  'HM실 (경영지원)',
];

const dataWorkHourOptions = ['1시간 미만', '1~3시간', '3~5시간', '5~10시간', '10시간 이상'];

const chatgptExperienceOptions = [
  '업무에 적극적으로 활용하고 있다.',
  '업무에 가끔 사용해 본다.',
  '개인적인 용도로만 사용해 봤다.',
  '사용해 본 적 없다.',
];

const willingnessOptions = ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다', '전혀 그렇지 않다'];

const helpfulAiOptions = [
  '[문서 자동화] 제안서, 보고서, 기사 등 초안 자동 작성 및 요약',
  '[디자인 보조] 발표자료, 홍보물 등 디자인 시안 자동 생성',
  '[데이터 분석] 시장/고객 데이터 분석 및 트렌드 예측',
  '[정보 검색] 사내 문서 및 과거 프로젝트 정보 기반 질의응답',
  '[번역/통역] 외국어 이메일 작성, 해외 자료 번역, 실시간 통역 지원',
  '[개인화 추천] 행사 참가자 대상 맞춤형 세션/네트워킹 추천',
];

export default function SurveyPage() {
  const [department, setDepartment] = useState('');
  const [primaryRole, setPrimaryRole] = useState('');
  const [repetitiveTasks, setRepetitiveTasks] = useState('');
  const [dataWorkHours, setDataWorkHours] = useState('');
  const [dataWorkExamples, setDataWorkExamples] = useState('');
  const [documentWorkExamples, setDocumentWorkExamples] = useState('');
  const [infoSearchDifficulty, setInfoSearchDifficulty] = useState('');
  const [aiAssistantTasks, setAiAssistantTasks] = useState('');
  const [helpfulAiFeatures, setHelpfulAiFeatures] = useState<HelpfulAIFeatures>([]);
  const [otherFeature, setOtherFeature] = useState('');
  const [otherFeatureChecked, setOtherFeatureChecked] = useState(false);
  const [chatgptExperience, setChatgptExperience] = useState('');
  const [chatgptLimit, setChatgptLimit] = useState('');
  const [willingnessToLearn, setWillingnessToLearn] = useState('');
  const [concerns, setConcerns] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFeatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setHelpfulAiFeatures(prev => [...prev, value]);
    } else {
      setHelpfulAiFeatures(prev => prev.filter(item => item !== value));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const finalFeatures = otherFeatureChecked && otherFeature
      ? [...helpfulAiFeatures, `기타: ${otherFeature}`]
      : helpfulAiFeatures;

    const { error } = await supabase.from('survey_responses').insert([
      {
        department,
        primary_role: primaryRole,
        repetitive_tasks: repetitiveTasks,
        data_work_hours: dataWorkHours,
        data_work_examples: dataWorkExamples,
        document_work_examples: documentWorkExamples,
        info_search_difficulty: infoSearchDifficulty,
        ai_assistant_tasks: aiAssistantTasks,
        helpful_ai_features: finalFeatures,
        chatgpt_experience: chatgptExperience,
        chatgpt_limitations: chatgptLimit,
        willingness_to_learn: willingnessToLearn,
        concerns,
      },
    ]);

    setIsSubmitting(false);
    if (error) {
      setSubmitMessage(`오류가 발생했습니다: ${error.message}`);
    } else {
      setSubmitMessage('설문에 참여해 주셔서 진심으로 감사합니다!');
    }
  };

  const renderRadioGroup = (
    question: string,
    options: string[],
    value: string,
    setter: (val: string) => void,
    number: string,
  ) => (
    <fieldset className="space-y-4">
      <legend className="flex items-start gap-2 text-base font-semibold text-slate-900">
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
          {number}
        </span>
        <span className="leading-6 text-slate-700">{question}</span>
      </legend>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map(option => {
          const isChecked = value === option;
          return (
            <label
              key={option}
              className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-lg ${
                isChecked ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200' : ''
              }`}
            >
              <input
                type="radio"
                name={`question-${number}`}
                value={option}
                checked={isChecked}
                onChange={e => setter(e.target.value)}
                className="mt-1 h-4 w-4 cursor-pointer rounded-full border-slate-300 text-emerald-500 focus:ring-emerald-400"
              />
              <span className={`text-sm leading-relaxed ${isChecked ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );

  const FormSection = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
    <section className="space-y-6 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600/70">Survey Part</p>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </header>
      <div className="space-y-8">{children}</div>
    </section>
  );

  const FormField = ({
    number,
    label,
    hint,
    children,
  }: {
    number: string;
    label: string;
    hint?: string;
    children: ReactNode;
  }) => (
    <div className="space-y-3">
      <label htmlFor={number} className="flex items-start gap-3 text-base font-semibold text-slate-900">
        <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
          {number}
        </span>
        <span className="leading-6 text-slate-700">
          {label}
          {hint && <span className="mt-1 block text-sm font-normal text-slate-500">{hint}</span>}
        </span>
      </label>
      {children}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-sky-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.9),_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 pb-16 pt-12 md:flex-row md:gap-12 md:px-10">
        <aside className="flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-md md:max-w-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-200 via-emerald-300 to-emerald-400 text-xl text-emerald-900">
              ☺️
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600">The Welcome Insight Hub</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">더웰컴 AI 도입 설문</h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            ChatGPT와 같은 현대적인 AI 경험에서 영감을 받은 인터페이스에서 여러분의 의견을 들려주세요. 생생한 현장 경험이 더 똑똑한 업무 환경을 만듭니다.
          </p>
          <dl className="grid grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="space-y-1 rounded-2xl border border-white/70 bg-white/90 p-4">
              <dt className="text-xs uppercase tracking-[0.25em] text-slate-500">진행 시간</dt>
              <dd className="text-lg font-semibold text-slate-900">약 4분</dd>
            </div>
            <div className="space-y-1 rounded-2xl border border-white/70 bg-white/90 p-4">
              <dt className="text-xs uppercase tracking-[0.25em] text-slate-500">응답 보안</dt>
              <dd className="text-lg font-semibold text-slate-900">100% 보호</dd>
            </div>
          </dl>
          <div className="hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 md:block">
            <p className="font-semibold text-emerald-700">Tip</p>
            <p className="mt-1 leading-relaxed">한 질문씩 차근차근 답해 주세요. 모든 항목은 나중에 다시 수정할 수 있습니다.</p>
          </div>
        </aside>

        <div className="flex-1">
          {submitMessage ? (
            <div
              className={`rounded-3xl border p-8 text-center text-base font-medium shadow-xl ${
                submitMessage.includes('오류')
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {submitMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <FormSection
                title="PART 1. 응답자 정보"
                description="현재 소속과 담당 직무를 알려주세요. 다양한 시각의 의견을 반영하고자 합니다."
              >
                {renderRadioGroup('소속 본부/실을 선택해 주세요.', departmentOptions, department, setDepartment, '1')}
                <FormField
                  number="2"
                  label="현재 담당하고 계신 주된 직무를 간략히 기재해 주세요."
                  hint="예: CES 서울관 PM, 글로벌 연수 기획"
                >
                  <input
                    id="2"
                    type="text"
                    value={primaryRole}
                    onChange={e => setPrimaryRole(e.target.value)}
                    placeholder="예: CES 서울관 PM, 글로벌 연수 기획"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  />
                </FormField>
              </FormSection>

              <FormSection
                title="PART 2. 현재 업무 분석"
                description="업무에서 반복되는 과정과 데이터 작업을 이해하여, AI가 도울 수 있는 지점을 파악합니다."
              >
                <FormField
                  number="3"
                  label="현재 업무 중, 가장 많은 시간을 차지하는 반복적인 수작업이 있다면 무엇인가요? (3가지 이내)"
                  hint="예: 매주/매월 작성하는 실적 보고서 데이터 취합, 프로젝트별 정산 증빙 서류 정리 등"
                >
                  <textarea
                    id="3"
                    value={repetitiveTasks}
                    onChange={e => setRepetitiveTasks(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  ></textarea>
                </FormField>
                {renderRadioGroup(
                  '데이터 수집, 분석, 보고와 관련된 업무에 주당 평균 몇 시간 정도를 사용하시나요?',
                  dataWorkHourOptions,
                  dataWorkHours,
                  setDataWorkHours,
                  '4',
                )}
                <FormField
                  number="5"
                  label="위 4번과 같은 데이터 관련 업무는 주로 무엇인가요? 구체적인 사례를 들어주세요."
                  hint="예: 행사 종료 후 만족도 조사 결과 분석, 특정 산업/기술 관련 시장 동향 리서치 및 요약 등"
                >
                  <textarea
                    id="5"
                    value={dataWorkExamples}
                    onChange={e => setDataWorkExamples(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  ></textarea>
                </FormField>
                <FormField
                  number="6"
                  label="기획서, 제안서, 보고서, 이메일 등 문서를 작성하거나, 발표 자료(PPT)를 만드는 데 많은 시간을 쏟는 업무는 무엇인가요?"
                  hint="예: 신규 사업 제안서 초안 작성, 클라이언트 대상 주간 보고 이메일 작성 등"
                >
                  <textarea
                    id="6"
                    value={documentWorkExamples}
                    onChange={e => setDocumentWorkExamples(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  ></textarea>
                </FormField>
                <FormField
                  number="7"
                  label="과거 프로젝트 자료, 사내 규정, 담당자 정보 등 업무에 필요한 정보를 찾기 위해 시간을 많이 사용하거나 어려움을 겪은 경험이 있으신가요?"
                  hint="어떤 종류의 정보였는지 구체적으로 작성해주세요."
                >
                  <textarea
                    id="7"
                    value={infoSearchDifficulty}
                    onChange={e => setInfoSearchDifficulty(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  ></textarea>
                </FormField>
              </FormSection>

              <FormSection
                title="PART 3. AI 도입에 대한 아이디어"
                description="AI가 여러분의 업무에서 어떤 역할을 할 수 있을지 상상해 보세요."
              >
                <FormField
                  number="8"
                  label="만약 나만의 AI 어시스턴트가 생긴다면, 현재 업무 중 어떤 부분을 가장 먼저 맡기고 싶으신가요?"
                  hint="'똑똑한 신입사원'이라 가정하고 자유롭게 상상하여 답변해주세요."
                >
                  <textarea
                    id="8"
                    value={aiAssistantTasks}
                    onChange={e => setAiAssistantTasks(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  ></textarea>
                </FormField>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                      9
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        다음 중 AI 기술이 도입되었을 때, 본인의 업무에 가장 도움이 될 것 같은 기능을 모두 선택해 주세요.
                      </p>
                      <p className="mt-1 text-sm text-slate-500">복수 선택이 가능합니다.</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {helpfulAiOptions.map(option => {
                      const isChecked = helpfulAiFeatures.includes(option);
                      return (
                        <label
                          key={option}
                          className={`group flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-lg ${
                            isChecked ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={option}
                            checked={isChecked}
                            onChange={handleFeatureChange}
                            className="mt-1 h-4 w-4 rounded-md border-slate-300 text-emerald-500 focus:ring-emerald-400"
                          />
                          <span className={`text-sm leading-relaxed ${isChecked ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                            {option}
                          </span>
                        </label>
                      );
                    })}
                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
                        <input
                          type="checkbox"
                          id="other-checkbox"
                          checked={otherFeatureChecked}
                          onChange={e => {
                            const checked = e.target.checked;
                            setOtherFeatureChecked(checked);
                            if (!checked) {
                              setOtherFeature('');
                            }
                          }}
                          className="h-4 w-4 rounded-md border-slate-300 text-emerald-500 focus:ring-emerald-400"
                        />
                        기타 선택 (직접 입력)
                      </label>
                      <input
                        id="other-feature"
                        type="text"
                        value={otherFeature}
                        onChange={e => setOtherFeature(e.target.value)}
                        placeholder="추가로 필요한 기능이 있다면 입력해주세요."
                        disabled={!otherFeatureChecked}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection
                title="PART 4. AI 기술 수용도 및 우려사항"
                description="AI와 함께 일하는 것에 대한 기대와 걱정을 솔직하게 들려주세요."
              >
                {renderRadioGroup(
                  'ChatGPT를 업무에 사용해 본 경험이 있으신가요?',
                  chatgptExperienceOptions,
                  chatgptExperience,
                  setChatgptExperience,
                  '10',
                )}
                {chatgptExperience.includes('업무') && (
                  <FormField
                    number="11"
                    label="ChatGPT를 업무에 활용하면서 느꼈던 한계점이나 아쉬웠던 점은 무엇이었나요?"
                    hint="예: 최신 정보나 특정 산업 분야 답변의 정확성이 떨어짐, 내부 자료 기반으로 답변을 생성하지 못함 등"
                  >
                    <textarea
                      id="11"
                      value={chatgptLimit}
                      onChange={e => setChatgptLimit(e.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                    ></textarea>
                  </FormField>
                )}
                {renderRadioGroup(
                  '회사에서 새로운 AI 기술이나 툴을 도입한다면, 배우고 활용할 의향이 있으신가요?',
                  willingnessOptions,
                  willingnessToLearn,
                  setWillingnessToLearn,
                  '12',
                )}
                <FormField
                  number="13"
                  label="우리 조직에 AI를 도입하는 것에 대해 우려되는 점이 있다면 자유롭게 말씀해 주세요."
                  hint="예: 내 일자리가 줄어들 것 같다, AI가 만든 결과물을 믿을 수 있을지 걱정된다 등"
                >
                  <textarea
                    id="13"
                    value={concerns}
                    onChange={e => setConcerns(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  ></textarea>
                </FormField>
              </FormSection>

              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-xl backdrop-blur-sm">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">설문 제출 준비가 되셨나요?</h3>
                <p className="max-w-2xl text-sm text-slate-600">
                  여러분이 남겨주시는 의견은 더 나은 AI 도입 전략을 만드는 데 큰 힘이 됩니다. 마지막으로 아래 버튼을 눌러 설문을 제출해주세요.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-emerald-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-emerald-200"
                >
                  {isSubmitting ? '제출 중...' : '설문 완료 및 제출'}
                  {!isSubmitting && <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
