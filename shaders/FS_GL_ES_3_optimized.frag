#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#elif GL_FRAGMENT_PRECISION_MEDIUM
	precision mediump float;
#else
	precision lowp float;
#endif
struct Ray {
  vec3 origin;
  vec3 dir;
};
struct Material {
  vec3 amb;
  vec3 dif;
  vec3 spec;
  float pow;
  bool refractive;
  bool reflective;
  vec3 f0;
  float n;
};
struct Light {
  vec3 col;
  vec3 pos;
};
struct Plane {
  vec3 n;
  vec3 q;
};
struct Disc {
  vec3 o;
  float r;
  vec3 n;
};
struct Triangle {
  vec3 A;
  vec3 B;
  vec3 C;
};
struct Stack {
  Ray ray;
  vec3 coeff;
  int depth;
};
in vec3 vsRay;
out lowp vec4 fragColor;
uniform vec3 eye;
uniform sampler2D sunTexture;
uniform sampler2D earthTexture;
uniform sampler2D earthNormalMap;
uniform sampler2D moonTexture;
uniform sampler2D moonNormalMap;
uniform sampler2D groundTexture;
uniform sampler2D skyboxTextureBack;
uniform sampler2D skyboxTextureDown;
uniform sampler2D skyboxTextureFront;
uniform sampler2D skyboxTextureLeft;
uniform sampler2D skyboxTextureRight;
uniform sampler2D skyboxTextureUp;
uniform Light lights[3];
uniform vec4 spheres[110];
uniform vec2 torus;
uniform Triangle triangles[14];
uniform float time;
uniform float skyboxRatio;
uniform Disc ground;
uniform Plane skyboxBack;
uniform Plane skyboxDown;
uniform Plane skyboxFront;
uniform Plane skyboxLeft;
uniform Plane skyboxRight;
uniform Plane skyboxUp;
uniform highp int depth;
uniform bool isShadowOn;
uniform bool useNormalMap;
uniform bool isGlowOn;
uniform int colorModeInTernary[3];
void main ()
{
  Ray ray_1;
  ray_1.origin = eye;
  ray_1.dir = normalize(vsRay);
  highp int i_2;
  bool continueLoop_3;
  lowp vec3 coeff_4;
  highp int bounceCount_5;
  highp int stackSize_6;
  Stack stack_7[8];
  lowp float v_8;
  lowp float u_9;
  highp int tmpvar_10;
  lowp float tmpvar_11;
  lowp vec3 tmpvar_12;
  lowp vec3 tmpvar_13;
  vec3 tmpvar_14;
  lowp vec3 color_15;
  color_15 = vec3(0.0, 0.0, 0.0);
  stackSize_6 = 0;
  bounceCount_5 = 1;
  coeff_4 = vec3(1.0, 1.0, 1.0);
  continueLoop_3 = bool(1);
  i_2 = 0;
  while (true) {
    if ((i_2 >= 16)) {
      break;
    };
    if (!(continueLoop_3)) {
      break;
    };
    vec3 tmpvar_16;
    vec3 tmpvar_17;
    tmpvar_16 = ray_1.origin;
    tmpvar_17 = ray_1.dir;
    highp int tmpvar_18;
    lowp float tmpvar_19;
    lowp vec3 tmpvar_20;
    lowp vec3 tmpvar_21;
    vec3 tmpvar_22;
    tmpvar_18 = tmpvar_10;
    tmpvar_19 = tmpvar_11;
    tmpvar_20 = tmpvar_12;
    tmpvar_21 = tmpvar_13;
    tmpvar_22 = tmpvar_14;
    bool hit_25;
    lowp float minT_26;
    highp int tmpvar_27;
    lowp float tmpvar_28;
    lowp vec3 tmpvar_29;
    lowp vec3 tmpvar_30;
    vec3 tmpvar_31;
    minT_26 = -1.0;
    hit_25 = bool(0);
    for (highp int i_24 = 0; i_24 < 110; i_24++) {
      vec4 sphere_32;
      sphere_32 = spheres[i_24];
      highp int tmpvar_33;
      lowp float tmpvar_34;
      lowp vec3 tmpvar_35;
      lowp vec3 tmpvar_36;
      vec3 tmpvar_37;
      bool tmpvar_38;
      float t_39;
      float t2_40;
      float t1_41;
      vec3 tmpvar_42;
      tmpvar_42 = (tmpvar_16 - sphere_32.xyz);
      float tmpvar_43;
      tmpvar_43 = (dot (tmpvar_42, tmpvar_17) * 2.0);
      float tmpvar_44;
      tmpvar_44 = dot (tmpvar_17, tmpvar_17);
      float tmpvar_45;
      tmpvar_45 = ((tmpvar_43 * tmpvar_43) - ((4.0 * tmpvar_44) * (
        dot (tmpvar_42, tmpvar_42)
       - 
        (sphere_32.w * sphere_32.w)
      )));
      if ((tmpvar_45 < 0.0)) {
        tmpvar_38 = bool(0);
      } else {
        float tmpvar_46;
        tmpvar_46 = sqrt(tmpvar_45);
        float tmpvar_47;
        tmpvar_47 = (((
          -(tmpvar_43)
         + tmpvar_46) / 2.0) / tmpvar_44);
        t1_41 = tmpvar_47;
        float tmpvar_48;
        tmpvar_48 = (((
          -(tmpvar_43)
         - tmpvar_46) / 2.0) / tmpvar_44);
        t2_40 = tmpvar_48;
        if ((tmpvar_47 < 0.001)) {
          t1_41 = -0.001;
        };
        if ((tmpvar_48 < 0.001)) {
          t2_40 = -0.001;
        };
        if ((t1_41 < 0.0)) {
          tmpvar_38 = bool(0);
        } else {
          if ((t2_40 > 0.0)) {
            t_39 = t2_40;
          } else {
            t_39 = t1_41;
          };
          tmpvar_33 = i_24;
          tmpvar_34 = t_39;
          tmpvar_37 = sphere_32.xyz;
          tmpvar_35 = (tmpvar_16 + (t_39 * tmpvar_17));
          tmpvar_36 = normalize((tmpvar_35 - sphere_32.xyz));
          tmpvar_38 = bool(1);
        };
      };
      tmpvar_27 = tmpvar_33;
      tmpvar_28 = tmpvar_34;
      tmpvar_29 = tmpvar_35;
      tmpvar_30 = tmpvar_36;
      tmpvar_31 = tmpvar_37;
      if (tmpvar_38) {
        if (((tmpvar_34 < minT_26) || (minT_26 < 0.0))) {
          minT_26 = tmpvar_34;
          tmpvar_18 = tmpvar_33;
          tmpvar_19 = tmpvar_34;
          tmpvar_20 = tmpvar_35;
          tmpvar_21 = tmpvar_36;
          tmpvar_22 = tmpvar_37;
        };
        hit_25 = bool(1);
      };
    };
    for (highp int i_23 = 110; i_23 < 124; i_23++) {
      Triangle t_49;
      t_49 = triangles[(i_23 - 110)];
      highp int tmpvar_50;
      lowp float tmpvar_51;
      lowp vec3 tmpvar_52;
      lowp vec3 tmpvar_53;
      vec3 tmpvar_54;
      bool tmpvar_55;
      float t1_56;
      float v_57;
      float u_58;
      float invDet_59;
      vec3 T_60;
      vec3 e2_61;
      vec3 e1_62;
      e1_62 = (t_49.B - t_49.A);
      e2_61 = (t_49.C - t_49.A);
      vec3 tmpvar_63;
      tmpvar_63 = ((tmpvar_17.yzx * e2_61.zxy) - (tmpvar_17.zxy * e2_61.yzx));
      invDet_59 = (1.0/(dot (e1_62, tmpvar_63)));
      T_60 = (tmpvar_16 - t_49.A);
      u_58 = (dot (T_60, tmpvar_63) * invDet_59);
      if (((u_58 < 0.0) || (u_58 > 1.0))) {
        tmpvar_55 = bool(0);
      } else {
        vec3 tmpvar_64;
        tmpvar_64 = ((T_60.yzx * e1_62.zxy) - (T_60.zxy * e1_62.yzx));
        v_57 = (dot (tmpvar_17, tmpvar_64) * invDet_59);
        if (((v_57 < 0.0) || ((u_58 + v_57) > 1.0))) {
          tmpvar_55 = bool(0);
        } else {
          t1_56 = (dot (e2_61, tmpvar_64) * invDet_59);
          if ((t1_56 > 0.001)) {
            tmpvar_51 = t1_56;
            tmpvar_50 = i_23;
            tmpvar_52 = (tmpvar_16 + (tmpvar_17 * t1_56));
            vec3 a_65;
            a_65 = (t_49.B - t_49.A);
            vec3 b_66;
            b_66 = (t_49.C - t_49.A);
            tmpvar_53 = normalize(((a_65.yzx * b_66.zxy) - (a_65.zxy * b_66.yzx)));
            tmpvar_54 = (((t_49.A + t_49.B) + t_49.C) / 3.0);
            tmpvar_55 = bool(1);
          } else {
            tmpvar_55 = bool(0);
          };
        };
      };
      tmpvar_27 = tmpvar_50;
      tmpvar_28 = tmpvar_51;
      tmpvar_29 = tmpvar_52;
      tmpvar_30 = tmpvar_53;
      tmpvar_31 = tmpvar_54;
      if (tmpvar_55) {
        if (((tmpvar_51 < minT_26) || (minT_26 < 0.0))) {
          minT_26 = tmpvar_51;
          tmpvar_18 = tmpvar_50;
          tmpvar_19 = tmpvar_51;
          tmpvar_20 = tmpvar_52;
          tmpvar_21 = tmpvar_53;
          tmpvar_22 = tmpvar_54;
        };
        hit_25 = bool(1);
      };
    };
    vec3 tmpvar_67;
    float tmpvar_68;
    lowp vec3 tmpvar_69;
    tmpvar_67 = ground.o;
    tmpvar_68 = ground.r;
    tmpvar_69 = ground.n;
    bool tmpvar_70;
    lowp float tmpvar_71;
    lowp vec3 tmpvar_72;
    lowp vec3 tmpvar_73;
    vec3 tmpvar_74;
    bool tmpvar_75;
    lowp float tmpvar_76;
    tmpvar_76 = (dot (tmpvar_69, (tmpvar_67 - tmpvar_16)) / dot (tmpvar_69, tmpvar_17));
    if ((tmpvar_76 < 0.001)) {
      tmpvar_75 = bool(0);
    } else {
      tmpvar_71 = tmpvar_76;
      tmpvar_74 = tmpvar_67;
      tmpvar_72 = (tmpvar_16 + (tmpvar_76 * tmpvar_17));
      tmpvar_73 = tmpvar_69;
      tmpvar_75 = bool(1);
    };
    if (tmpvar_75) {
      lowp vec3 tmpvar_77;
      tmpvar_77 = ((tmpvar_16 + (tmpvar_71 * tmpvar_17)) - tmpvar_67);
      lowp float tmpvar_78;
      tmpvar_78 = sqrt(dot (tmpvar_77, tmpvar_77));
      if ((tmpvar_78 > tmpvar_68)) {
        tmpvar_70 = bool(0);
      } else {
        tmpvar_70 = bool(1);
      };
    } else {
      tmpvar_70 = bool(0);
    };
    tmpvar_27 = 124;
    tmpvar_28 = tmpvar_71;
    tmpvar_29 = tmpvar_72;
    tmpvar_30 = tmpvar_73;
    tmpvar_31 = tmpvar_74;
    if (tmpvar_70) {
      if (((tmpvar_71 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_71;
        tmpvar_18 = 124;
        tmpvar_19 = tmpvar_71;
        tmpvar_20 = tmpvar_72;
        tmpvar_21 = tmpvar_73;
        tmpvar_22 = tmpvar_74;
      };
      hit_25 = bool(1);
    };
    bool tmpvar_79;
    if ((bounceCount_5 > 1)) {
      vec3 tmpvar_80;
      tmpvar_80.yz = tmpvar_16.yz;
      lowp float tmpvar_81;
      lowp vec3 tmpvar_82;
      lowp vec3 tmpvar_83;
      vec3 tmpvar_84;
      bool tmpvar_85;
      tmpvar_85 = bool(1);
      bool tmpvar_86;
      float result_87;
      float d2_88;
      float d1_89;
      float z_90;
      float h_91;
      float r_92;
      float p_93;
      tmpvar_80.x = (tmpvar_16.x - 10.0);
      float tmpvar_94;
      tmpvar_94 = (torus.x * torus.x);
      float tmpvar_95;
      tmpvar_95 = (torus.y * torus.y);
      float tmpvar_96;
      tmpvar_96 = dot (tmpvar_80, tmpvar_17);
      float tmpvar_97;
      tmpvar_97 = (((
        dot (tmpvar_80, tmpvar_80)
       - tmpvar_95) - tmpvar_94) / 2.0);
      float tmpvar_98;
      tmpvar_98 = (((tmpvar_96 * tmpvar_96) + (
        (tmpvar_94 * tmpvar_17.z)
       * tmpvar_17.z)) + tmpvar_97);
      float tmpvar_99;
      tmpvar_99 = ((tmpvar_97 * tmpvar_96) + ((tmpvar_94 * tmpvar_16.z) * tmpvar_17.z));
      float tmpvar_100;
      tmpvar_100 = (((
        (2.0 * tmpvar_96)
       * 
        (tmpvar_96 * tmpvar_96)
      ) - (
        (2.0 * tmpvar_96)
       * tmpvar_98)) + (2.0 * tmpvar_99));
      p_93 = (((
        (-3.0 * tmpvar_96)
       * tmpvar_96) + (2.0 * tmpvar_98)) / 3.0);
      r_92 = (((
        (((-3.0 * tmpvar_96) * ((tmpvar_96 * tmpvar_96) * tmpvar_96)) + ((4.0 * tmpvar_96) * (tmpvar_96 * tmpvar_98)))
       - 
        ((8.0 * tmpvar_96) * tmpvar_99)
      ) + (4.0 * 
        (((tmpvar_97 * tmpvar_97) + ((tmpvar_94 * tmpvar_16.z) * tmpvar_16.z)) - (tmpvar_94 * tmpvar_95))
      )) / 3.0);
      float tmpvar_101;
      tmpvar_101 = ((p_93 * p_93) + r_92);
      float tmpvar_102;
      tmpvar_102 = (((
        (3.0 * r_92)
       * p_93) - (
        (p_93 * p_93)
       * p_93)) - (tmpvar_100 * tmpvar_100));
      float tmpvar_103;
      tmpvar_103 = ((tmpvar_102 * tmpvar_102) - ((tmpvar_101 * tmpvar_101) * tmpvar_101));
      h_91 = tmpvar_103;
      z_90 = 0.0;
      if ((tmpvar_103 < 0.0)) {
        float tmpvar_104;
        tmpvar_104 = sqrt(tmpvar_101);
        float x_105;
        x_105 = (tmpvar_102 / (tmpvar_104 * tmpvar_101));
        z_90 = ((2.0 * tmpvar_104) * cos((
          (1.570796 - (sign(x_105) * (1.570796 - (
            sqrt((1.0 - abs(x_105)))
           * 
            (1.570796 + (abs(x_105) * (-0.2146018 + (
              abs(x_105)
             * 
              (0.08656672 + (abs(x_105) * -0.03102955))
            ))))
          ))))
         / 3.0)));
      } else {
        float tmpvar_106;
        tmpvar_106 = pow ((sqrt(tmpvar_103) + abs(tmpvar_102)), 0.3333333);
        z_90 = (sign(tmpvar_102) * abs((tmpvar_106 + 
          (tmpvar_101 / tmpvar_106)
        )));
      };
      z_90 = (p_93 - z_90);
      float tmpvar_107;
      tmpvar_107 = (z_90 - (3.0 * p_93));
      d1_89 = tmpvar_107;
      float tmpvar_108;
      tmpvar_108 = ((z_90 * z_90) - (3.0 * r_92));
      d2_88 = tmpvar_108;
      float tmpvar_109;
      tmpvar_109 = abs(tmpvar_107);
      if ((tmpvar_109 < 0.001)) {
        if ((tmpvar_108 < 0.0)) {
          tmpvar_86 = bool(0);
          tmpvar_85 = bool(0);
        } else {
          d2_88 = sqrt(tmpvar_108);
        };
      } else {
        if ((tmpvar_107 < 0.0)) {
          tmpvar_86 = bool(0);
          tmpvar_85 = bool(0);
        } else {
          float tmpvar_110;
          tmpvar_110 = sqrt((tmpvar_107 / 2.0));
          d1_89 = tmpvar_110;
          d2_88 = (tmpvar_100 / tmpvar_110);
        };
      };
      if (tmpvar_85) {
        result_87 = 1e+20;
        h_91 = (((d1_89 * d1_89) - z_90) + d2_88);
        if ((h_91 > 0.0)) {
          float tmpvar_111;
          tmpvar_111 = sqrt(h_91);
          h_91 = tmpvar_111;
          float tmpvar_112;
          tmpvar_112 = ((-(d1_89) - tmpvar_111) - tmpvar_96);
          float tmpvar_113;
          tmpvar_113 = ((-(d1_89) + tmpvar_111) - tmpvar_96);
          if ((tmpvar_112 > 0.0)) {
            result_87 = tmpvar_112;
          } else {
            if ((tmpvar_113 > 0.0)) {
              result_87 = tmpvar_113;
            };
          };
        };
        h_91 = (((d1_89 * d1_89) - z_90) - d2_88);
        if ((h_91 > 0.0)) {
          float tmpvar_114;
          tmpvar_114 = sqrt(h_91);
          h_91 = tmpvar_114;
          float tmpvar_115;
          tmpvar_115 = ((d1_89 - tmpvar_114) - tmpvar_96);
          float tmpvar_116;
          tmpvar_116 = ((d1_89 + tmpvar_114) - tmpvar_96);
          if ((tmpvar_115 > 0.0)) {
            result_87 = min (result_87, tmpvar_115);
          } else {
            if ((tmpvar_116 > 0.0)) {
              result_87 = min (result_87, tmpvar_116);
            };
          };
        };
        if (((result_87 > 0.0) && (result_87 < 1000.0))) {
          tmpvar_81 = result_87;
          tmpvar_82 = (tmpvar_80 + (result_87 * tmpvar_17));
          tmpvar_83 = normalize((tmpvar_82 * (
            (dot (tmpvar_82, tmpvar_82) - (torus.y * torus.y))
           - 
            ((torus.x * torus.x) * vec3(1.0, 1.0, -1.0))
          )));
          tmpvar_86 = bool(1);
          tmpvar_85 = bool(0);
        } else {
          tmpvar_86 = bool(0);
          tmpvar_85 = bool(0);
        };
      };
      tmpvar_27 = 125;
      tmpvar_28 = tmpvar_81;
      tmpvar_29 = tmpvar_82;
      tmpvar_30 = tmpvar_83;
      tmpvar_31 = tmpvar_84;
      tmpvar_79 = tmpvar_86;
    } else {
      tmpvar_79 = bool(0);
    };
    if (tmpvar_79) {
      if (((tmpvar_28 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_28;
        tmpvar_18 = tmpvar_27;
        tmpvar_19 = tmpvar_28;
        tmpvar_20 = tmpvar_29;
        tmpvar_21 = tmpvar_30;
        tmpvar_22 = tmpvar_31;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_117;
    vec3 tmpvar_118;
    tmpvar_117 = skyboxBack.n;
    tmpvar_118 = skyboxBack.q;
    lowp float tmpvar_119;
    lowp vec3 tmpvar_120;
    lowp vec3 tmpvar_121;
    vec3 tmpvar_122;
    bool tmpvar_123;
    lowp float tmpvar_124;
    tmpvar_124 = (dot (tmpvar_117, (tmpvar_118 - tmpvar_16)) / dot (tmpvar_117, tmpvar_17));
    if ((tmpvar_124 < 0.001)) {
      tmpvar_123 = bool(0);
    } else {
      tmpvar_119 = tmpvar_124;
      tmpvar_122 = tmpvar_118;
      tmpvar_120 = (tmpvar_16 + (tmpvar_124 * tmpvar_17));
      tmpvar_121 = tmpvar_117;
      tmpvar_123 = bool(1);
    };
    tmpvar_27 = 126;
    tmpvar_28 = tmpvar_119;
    tmpvar_29 = tmpvar_120;
    tmpvar_30 = tmpvar_121;
    tmpvar_31 = tmpvar_122;
    if (tmpvar_123) {
      if (((tmpvar_119 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_119;
        tmpvar_18 = 126;
        tmpvar_19 = tmpvar_119;
        tmpvar_20 = tmpvar_120;
        tmpvar_21 = tmpvar_121;
        tmpvar_22 = tmpvar_122;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_125;
    vec3 tmpvar_126;
    tmpvar_125 = skyboxDown.n;
    tmpvar_126 = skyboxDown.q;
    lowp float tmpvar_127;
    lowp vec3 tmpvar_128;
    lowp vec3 tmpvar_129;
    vec3 tmpvar_130;
    bool tmpvar_131;
    lowp float tmpvar_132;
    tmpvar_132 = (dot (tmpvar_125, (tmpvar_126 - tmpvar_16)) / dot (tmpvar_125, tmpvar_17));
    if ((tmpvar_132 < 0.001)) {
      tmpvar_131 = bool(0);
    } else {
      tmpvar_127 = tmpvar_132;
      tmpvar_130 = tmpvar_126;
      tmpvar_128 = (tmpvar_16 + (tmpvar_132 * tmpvar_17));
      tmpvar_129 = tmpvar_125;
      tmpvar_131 = bool(1);
    };
    tmpvar_27 = 127;
    tmpvar_28 = tmpvar_127;
    tmpvar_29 = tmpvar_128;
    tmpvar_30 = tmpvar_129;
    tmpvar_31 = tmpvar_130;
    if (tmpvar_131) {
      if (((tmpvar_127 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_127;
        tmpvar_18 = 127;
        tmpvar_19 = tmpvar_127;
        tmpvar_20 = tmpvar_128;
        tmpvar_21 = tmpvar_129;
        tmpvar_22 = tmpvar_130;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_133;
    vec3 tmpvar_134;
    tmpvar_133 = skyboxFront.n;
    tmpvar_134 = skyboxFront.q;
    lowp float tmpvar_135;
    lowp vec3 tmpvar_136;
    lowp vec3 tmpvar_137;
    vec3 tmpvar_138;
    bool tmpvar_139;
    lowp float tmpvar_140;
    tmpvar_140 = (dot (tmpvar_133, (tmpvar_134 - tmpvar_16)) / dot (tmpvar_133, tmpvar_17));
    if ((tmpvar_140 < 0.001)) {
      tmpvar_139 = bool(0);
    } else {
      tmpvar_135 = tmpvar_140;
      tmpvar_138 = tmpvar_134;
      tmpvar_136 = (tmpvar_16 + (tmpvar_140 * tmpvar_17));
      tmpvar_137 = tmpvar_133;
      tmpvar_139 = bool(1);
    };
    tmpvar_27 = 128;
    tmpvar_28 = tmpvar_135;
    tmpvar_29 = tmpvar_136;
    tmpvar_30 = tmpvar_137;
    tmpvar_31 = tmpvar_138;
    if (tmpvar_139) {
      if (((tmpvar_135 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_135;
        tmpvar_18 = 128;
        tmpvar_19 = tmpvar_135;
        tmpvar_20 = tmpvar_136;
        tmpvar_21 = tmpvar_137;
        tmpvar_22 = tmpvar_138;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_141;
    vec3 tmpvar_142;
    tmpvar_141 = skyboxLeft.n;
    tmpvar_142 = skyboxLeft.q;
    lowp float tmpvar_143;
    lowp vec3 tmpvar_144;
    lowp vec3 tmpvar_145;
    vec3 tmpvar_146;
    bool tmpvar_147;
    lowp float tmpvar_148;
    tmpvar_148 = (dot (tmpvar_141, (tmpvar_142 - tmpvar_16)) / dot (tmpvar_141, tmpvar_17));
    if ((tmpvar_148 < 0.001)) {
      tmpvar_147 = bool(0);
    } else {
      tmpvar_143 = tmpvar_148;
      tmpvar_146 = tmpvar_142;
      tmpvar_144 = (tmpvar_16 + (tmpvar_148 * tmpvar_17));
      tmpvar_145 = tmpvar_141;
      tmpvar_147 = bool(1);
    };
    tmpvar_27 = 129;
    tmpvar_28 = tmpvar_143;
    tmpvar_29 = tmpvar_144;
    tmpvar_30 = tmpvar_145;
    tmpvar_31 = tmpvar_146;
    if (tmpvar_147) {
      if (((tmpvar_143 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_143;
        tmpvar_18 = 129;
        tmpvar_19 = tmpvar_143;
        tmpvar_20 = tmpvar_144;
        tmpvar_21 = tmpvar_145;
        tmpvar_22 = tmpvar_146;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_149;
    vec3 tmpvar_150;
    tmpvar_149 = skyboxRight.n;
    tmpvar_150 = skyboxRight.q;
    lowp float tmpvar_151;
    lowp vec3 tmpvar_152;
    lowp vec3 tmpvar_153;
    vec3 tmpvar_154;
    bool tmpvar_155;
    lowp float tmpvar_156;
    tmpvar_156 = (dot (tmpvar_149, (tmpvar_150 - tmpvar_16)) / dot (tmpvar_149, tmpvar_17));
    if ((tmpvar_156 < 0.001)) {
      tmpvar_155 = bool(0);
    } else {
      tmpvar_151 = tmpvar_156;
      tmpvar_154 = tmpvar_150;
      tmpvar_152 = (tmpvar_16 + (tmpvar_156 * tmpvar_17));
      tmpvar_153 = tmpvar_149;
      tmpvar_155 = bool(1);
    };
    tmpvar_27 = 130;
    tmpvar_28 = tmpvar_151;
    tmpvar_29 = tmpvar_152;
    tmpvar_30 = tmpvar_153;
    tmpvar_31 = tmpvar_154;
    if (tmpvar_155) {
      if (((tmpvar_151 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_151;
        tmpvar_18 = 130;
        tmpvar_19 = tmpvar_151;
        tmpvar_20 = tmpvar_152;
        tmpvar_21 = tmpvar_153;
        tmpvar_22 = tmpvar_154;
      };
      hit_25 = bool(1);
    };
    lowp vec3 tmpvar_157;
    vec3 tmpvar_158;
    tmpvar_157 = skyboxUp.n;
    tmpvar_158 = skyboxUp.q;
    lowp float tmpvar_159;
    lowp vec3 tmpvar_160;
    lowp vec3 tmpvar_161;
    vec3 tmpvar_162;
    bool tmpvar_163;
    lowp float tmpvar_164;
    tmpvar_164 = (dot (tmpvar_157, (tmpvar_158 - tmpvar_16)) / dot (tmpvar_157, tmpvar_17));
    if ((tmpvar_164 < 0.001)) {
      tmpvar_163 = bool(0);
    } else {
      tmpvar_159 = tmpvar_164;
      tmpvar_162 = tmpvar_158;
      tmpvar_160 = (tmpvar_16 + (tmpvar_164 * tmpvar_17));
      tmpvar_161 = tmpvar_157;
      tmpvar_163 = bool(1);
    };
    tmpvar_27 = 131;
    tmpvar_28 = tmpvar_159;
    tmpvar_29 = tmpvar_160;
    tmpvar_30 = tmpvar_161;
    tmpvar_31 = tmpvar_162;
    if (tmpvar_163) {
      if (((tmpvar_159 < minT_26) || (minT_26 < 0.0))) {
        minT_26 = tmpvar_159;
        tmpvar_18 = 131;
        tmpvar_19 = tmpvar_159;
        tmpvar_20 = tmpvar_160;
        tmpvar_21 = tmpvar_161;
        tmpvar_22 = tmpvar_162;
      };
      hit_25 = bool(1);
    };
    tmpvar_10 = tmpvar_18;
    tmpvar_11 = tmpvar_19;
    tmpvar_12 = tmpvar_20;
    tmpvar_13 = tmpvar_21;
    tmpvar_14 = tmpvar_22;
    if (hit_25) {
      lowp float vec_y_165;
      vec_y_165 = -(tmpvar_21.z);
      lowp float vec_x_166;
      vec_x_166 = -(tmpvar_21.x);
      lowp float tmpvar_167;
      lowp float tmpvar_168;
      tmpvar_168 = (min (abs(
        (vec_y_165 / vec_x_166)
      ), 1.0) / max (abs(
        (vec_y_165 / vec_x_166)
      ), 1.0));
      lowp float tmpvar_169;
      tmpvar_169 = (tmpvar_168 * tmpvar_168);
      tmpvar_169 = (((
        ((((
          ((((-0.01213232 * tmpvar_169) + 0.05368138) * tmpvar_169) - 0.1173503)
         * tmpvar_169) + 0.1938925) * tmpvar_169) - 0.3326756)
       * tmpvar_169) + 0.9999793) * tmpvar_168);
      tmpvar_169 = (tmpvar_169 + (float(
        (abs((vec_y_165 / vec_x_166)) > 1.0)
      ) * (
        (tmpvar_169 * -2.0)
       + 1.570796)));
      tmpvar_167 = (tmpvar_169 * sign((vec_y_165 / vec_x_166)));
      if ((abs(vec_x_166) > (1e-08 * abs(vec_y_165)))) {
        if ((vec_x_166 < 0.0)) {
          if ((vec_y_165 >= 0.0)) {
            tmpvar_167 += 3.141593;
          } else {
            tmpvar_167 = (tmpvar_167 - 3.141593);
          };
        };
      } else {
        tmpvar_167 = (sign(vec_y_165) * 1.570796);
      };
      u_9 = (0.5 - (tmpvar_167 / 6.283185));
      lowp float x_170;
      x_170 = -(tmpvar_21.y);
      v_8 = (0.5 + ((
        sign(x_170)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_170)
        )) * (1.570796 + (
          abs(x_170)
         * 
          (-0.2146018 + (abs(x_170) * (0.08656672 + (
            abs(x_170)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_18 == 3)) {
          lowp vec3 normalFromMap_171;
          u_9 = (u_9 + (time / 2.0));
          lowp vec2 tmpvar_172;
          tmpvar_172.x = u_9;
          tmpvar_172.y = v_8;
          normalFromMap_171 = normalize(((2.0 * texture (earthNormalMap, tmpvar_172).xyz) - 1.0));
          lowp mat3 tmpvar_173;
          lowp float tmpvar_174;
          tmpvar_174 = (1.570796 - (sign(tmpvar_21.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_21.z))) * (1.570796 + (abs(tmpvar_21.z) * (-0.2146018 + 
              (abs(tmpvar_21.z) * (0.08656672 + (abs(tmpvar_21.z) * -0.03102955)))
            ))))
          )));
          lowp vec3 tmpvar_175;
          tmpvar_175 = ((tmpvar_21.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_21.zxy * vec3(0.0, 1.0, 0.0)));
          lowp float tmpvar_176;
          tmpvar_176 = sqrt(dot (tmpvar_175, tmpvar_175));
          if ((tmpvar_176 < 0.001)) {
            tmpvar_173 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            lowp vec3 tmpvar_177;
            tmpvar_177 = normalize(tmpvar_175);
            lowp float tmpvar_178;
            tmpvar_178 = sin(tmpvar_174);
            lowp float tmpvar_179;
            tmpvar_179 = cos(tmpvar_174);
            lowp float tmpvar_180;
            tmpvar_180 = (1.0 - tmpvar_179);
            lowp mat3 tmpvar_181;
            tmpvar_181[uint(0)].x = (((tmpvar_180 * tmpvar_177.x) * tmpvar_177.x) + tmpvar_179);
            tmpvar_181[uint(0)].y = (((tmpvar_180 * tmpvar_177.x) * tmpvar_177.y) - (tmpvar_177.z * tmpvar_178));
            tmpvar_181[uint(0)].z = (((tmpvar_180 * tmpvar_177.z) * tmpvar_177.x) + (tmpvar_177.y * tmpvar_178));
            tmpvar_181[1u].x = (((tmpvar_180 * tmpvar_177.x) * tmpvar_177.y) + (tmpvar_177.z * tmpvar_178));
            tmpvar_181[1u].y = (((tmpvar_180 * tmpvar_177.y) * tmpvar_177.y) + tmpvar_179);
            tmpvar_181[1u].z = (((tmpvar_180 * tmpvar_177.y) * tmpvar_177.z) - (tmpvar_177.x * tmpvar_178));
            tmpvar_181[2u].x = (((tmpvar_180 * tmpvar_177.z) * tmpvar_177.x) - (tmpvar_177.y * tmpvar_178));
            tmpvar_181[2u].y = (((tmpvar_180 * tmpvar_177.y) * tmpvar_177.z) + (tmpvar_177.x * tmpvar_178));
            tmpvar_181[2u].z = (((tmpvar_180 * tmpvar_177.z) * tmpvar_177.z) + tmpvar_179);
            tmpvar_173 = tmpvar_181;
          };
          tmpvar_13 = (tmpvar_173 * normalFromMap_171);
        } else {
          if ((tmpvar_18 == 4)) {
            lowp vec3 normalFromMap_182;
            u_9 = (u_9 + (time / 7.0));
            lowp vec2 tmpvar_183;
            tmpvar_183.x = u_9;
            tmpvar_183.y = v_8;
            normalFromMap_182 = normalize(((2.0 * texture (moonNormalMap, tmpvar_183).xyz) - 1.0));
            lowp mat3 tmpvar_184;
            lowp float tmpvar_185;
            tmpvar_185 = (1.570796 - (sign(tmpvar_13.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_13.z))) * (1.570796 + (abs(tmpvar_13.z) * (-0.2146018 + 
                (abs(tmpvar_13.z) * (0.08656672 + (abs(tmpvar_13.z) * -0.03102955)))
              ))))
            )));
            lowp vec3 tmpvar_186;
            tmpvar_186 = ((tmpvar_13.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_13.zxy * vec3(0.0, 1.0, 0.0)));
            lowp float tmpvar_187;
            tmpvar_187 = sqrt(dot (tmpvar_186, tmpvar_186));
            if ((tmpvar_187 < 0.001)) {
              tmpvar_184 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              lowp vec3 tmpvar_188;
              tmpvar_188 = normalize(tmpvar_186);
              lowp float tmpvar_189;
              tmpvar_189 = sin(tmpvar_185);
              lowp float tmpvar_190;
              tmpvar_190 = cos(tmpvar_185);
              lowp float tmpvar_191;
              tmpvar_191 = (1.0 - tmpvar_190);
              lowp mat3 tmpvar_192;
              tmpvar_192[uint(0)].x = (((tmpvar_191 * tmpvar_188.x) * tmpvar_188.x) + tmpvar_190);
              tmpvar_192[uint(0)].y = (((tmpvar_191 * tmpvar_188.x) * tmpvar_188.y) - (tmpvar_188.z * tmpvar_189));
              tmpvar_192[uint(0)].z = (((tmpvar_191 * tmpvar_188.z) * tmpvar_188.x) + (tmpvar_188.y * tmpvar_189));
              tmpvar_192[1u].x = (((tmpvar_191 * tmpvar_188.x) * tmpvar_188.y) + (tmpvar_188.z * tmpvar_189));
              tmpvar_192[1u].y = (((tmpvar_191 * tmpvar_188.y) * tmpvar_188.y) + tmpvar_190);
              tmpvar_192[1u].z = (((tmpvar_191 * tmpvar_188.y) * tmpvar_188.z) - (tmpvar_188.x * tmpvar_189));
              tmpvar_192[2u].x = (((tmpvar_191 * tmpvar_188.z) * tmpvar_188.x) - (tmpvar_188.y * tmpvar_189));
              tmpvar_192[2u].y = (((tmpvar_191 * tmpvar_188.y) * tmpvar_188.z) + (tmpvar_188.x * tmpvar_189));
              tmpvar_192[2u].z = (((tmpvar_191 * tmpvar_188.z) * tmpvar_188.z) + tmpvar_190);
              tmpvar_184 = tmpvar_192;
            };
            tmpvar_13 = (tmpvar_184 * normalFromMap_182);
          };
        };
      };
      bounceCount_5++;
      lowp vec3 tmpvar_193;
      bool tmpvar_194;
      bool tmpvar_195;
      vec3 tmpvar_196;
      float tmpvar_197;
      Material tmpvar_198;
      if ((tmpvar_18 == 0)) {
        tmpvar_198 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_18 == 1)) {
          tmpvar_198 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 2)) {
            tmpvar_198 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 3)) {
              tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 4)) {
                tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if (((tmpvar_18 == 5) || (tmpvar_18 == 6))) {
                  tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_18 == 7)) {
                    tmpvar_198 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 8)) {
                      tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                    } else {
                      if ((tmpvar_18 == 9)) {
                        tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                      } else {
                        if (((tmpvar_18 >= 10) && (tmpvar_18 < 110))) {
                          tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                        } else {
                          if (((tmpvar_18 == 110) || (tmpvar_18 == 111))) {
                            tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_18 > 111) && (tmpvar_18 < 124))) {
                              tmpvar_198 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                            } else {
                              if ((tmpvar_18 == 124)) {
                                tmpvar_198 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_18 == 125)) {
                                  tmpvar_198 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 > 125)) {
                                    tmpvar_198 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_198 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      tmpvar_193 = tmpvar_198.amb;
      tmpvar_194 = tmpvar_198.refractive;
      tmpvar_195 = tmpvar_198.reflective;
      tmpvar_196 = tmpvar_198.f0;
      tmpvar_197 = tmpvar_198.n;
      lowp vec3 tmpvar_199;
      if ((tmpvar_18 == 0)) {
        tmpvar_199 = tmpvar_193;
      } else {
        highp int tmpvar_200;
        lowp vec3 tmpvar_201;
        lowp vec3 tmpvar_202;
        tmpvar_200 = tmpvar_18;
        tmpvar_201 = tmpvar_20;
        tmpvar_202 = tmpvar_13;
        highp int j_203;
        lowp vec3 specular_204;
        lowp vec3 diffuse_205;
        lowp vec3 color_206;
        lowp vec3 refDir_207;
        lowp vec3 I_208;
        I_208 = (tmpvar_20 - ray_1.origin);
        refDir_207 = normalize((I_208 - (2.0 * 
          (dot (tmpvar_13, I_208) * tmpvar_13)
        )));
        Material tmpvar_209;
        if ((tmpvar_18 == 0)) {
          tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_18 == 1)) {
            tmpvar_209 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_18 == 2)) {
              tmpvar_209 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_18 == 3)) {
                tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_18 == 4)) {
                  tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if (((tmpvar_18 == 5) || (tmpvar_18 == 6))) {
                    tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_18 == 7)) {
                      tmpvar_209 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_18 == 8)) {
                        tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_18 == 9)) {
                          tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_18 >= 10) && (tmpvar_18 < 110))) {
                            tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_18 == 110) || (tmpvar_18 == 111))) {
                              tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_18 > 111) && (tmpvar_18 < 124))) {
                                tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                              } else {
                                if ((tmpvar_18 == 124)) {
                                  tmpvar_209 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_18 == 125)) {
                                    tmpvar_209 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_18 > 125)) {
                                      tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        color_206 = tmpvar_209.amb;
        diffuse_205 = vec3(0.0, 0.0, 0.0);
        specular_204 = vec3(0.0, 0.0, 0.0);
        j_203 = 0;
        while (true) {
          lowp float diffintensity_210;
          if ((j_203 >= 3)) {
            break;
          };
          lowp vec3 tmpvar_211;
          tmpvar_211 = normalize((lights[j_203].pos - tmpvar_201));
          diffintensity_210 = clamp (dot (tmpvar_202, tmpvar_211), 0.0, 1.0);
          vec3 tmpvar_212;
          Material tmpvar_213;
          if ((tmpvar_200 == 0)) {
            tmpvar_213 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_200 == 1)) {
              tmpvar_213 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_200 == 2)) {
                tmpvar_213 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_200 == 3)) {
                  tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_200 == 4)) {
                    tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_200 == 5) || (tmpvar_200 == 6))) {
                      tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_200 == 7)) {
                        tmpvar_213 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_200 == 8)) {
                          tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_200 == 9)) {
                            tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_200 >= 10) && (tmpvar_200 < 110))) {
                              tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_200 == 110) || (tmpvar_200 == 111))) {
                                tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_200 > 111) && (tmpvar_200 < 124))) {
                                  tmpvar_213 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_200 == 124)) {
                                    tmpvar_213 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_200 == 125)) {
                                      tmpvar_213 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_200 > 125)) {
                                        tmpvar_213 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_213 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          tmpvar_212 = tmpvar_213.spec;
          lowp float tmpvar_214;
          tmpvar_214 = clamp (dot (tmpvar_211, refDir_207), 0.0, 1.0);
          Material tmpvar_215;
          if ((tmpvar_200 == 0)) {
            tmpvar_215 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_200 == 1)) {
              tmpvar_215 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_200 == 2)) {
                tmpvar_215 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_200 == 3)) {
                  tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_200 == 4)) {
                    tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_200 == 5) || (tmpvar_200 == 6))) {
                      tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_200 == 7)) {
                        tmpvar_215 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_200 == 8)) {
                          tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_200 == 9)) {
                            tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_200 >= 10) && (tmpvar_200 < 110))) {
                              tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_200 == 110) || (tmpvar_200 == 111))) {
                                tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_200 > 111) && (tmpvar_200 < 124))) {
                                  tmpvar_215 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_200 == 124)) {
                                    tmpvar_215 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_200 == 125)) {
                                      tmpvar_215 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_200 > 125)) {
                                        tmpvar_215 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_215 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          specular_204 = clamp (((tmpvar_212 * lights[j_203].col) * pow (tmpvar_214, tmpvar_215.pow)), 0.0, 1.0);
          Material tmpvar_216;
          if ((tmpvar_200 == 0)) {
            tmpvar_216 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_200 == 1)) {
              tmpvar_216 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_200 == 2)) {
                tmpvar_216 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_200 == 3)) {
                  tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_200 == 4)) {
                    tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if (((tmpvar_200 == 5) || (tmpvar_200 == 6))) {
                      tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_200 == 7)) {
                        tmpvar_216 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_200 == 8)) {
                          tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_200 == 9)) {
                            tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_200 >= 10) && (tmpvar_200 < 110))) {
                              tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_200 == 110) || (tmpvar_200 == 111))) {
                                tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if (((tmpvar_200 > 111) && (tmpvar_200 < 124))) {
                                  tmpvar_216 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                                } else {
                                  if ((tmpvar_200 == 124)) {
                                    tmpvar_216 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    if ((tmpvar_200 == 125)) {
                                      tmpvar_216 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8, 0.8, 0.8), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                    } else {
                                      if ((tmpvar_200 > 125)) {
                                        tmpvar_216 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      } else {
                                        tmpvar_216 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
          diffuse_205 = clamp (((tmpvar_216.dif * diffintensity_210) * lights[j_203].col), 0.0, 1.0);
          if (isShadowOn) {
            lowp vec3 tmpvar_217;
            lowp vec3 tmpvar_218;
            tmpvar_217 = (tmpvar_201 + (tmpvar_202 * 0.001));
            tmpvar_218 = normalize((lights[j_203].pos - tmpvar_201));
            highp int tmpvar_219;
            tmpvar_219 = tmpvar_200;
            highp int i_220;
            highp int i_221;
            lowp float minT_222;
            minT_222 = -1.0;
            i_221 = 0;
            while (true) {
              if ((i_221 >= 110)) {
                break;
              };
              vec4 sphere_223;
              sphere_223 = spheres[i_221];
              highp int tmpvar_224;
              lowp float tmpvar_225;
              bool tmpvar_226;
              lowp float t_227;
              lowp float t2_228;
              lowp float t1_229;
              lowp vec3 tmpvar_230;
              tmpvar_230 = (tmpvar_217 - sphere_223.xyz);
              lowp float tmpvar_231;
              tmpvar_231 = (dot (tmpvar_230, tmpvar_218) * 2.0);
              lowp float tmpvar_232;
              tmpvar_232 = dot (tmpvar_218, tmpvar_218);
              lowp float tmpvar_233;
              tmpvar_233 = ((tmpvar_231 * tmpvar_231) - ((4.0 * tmpvar_232) * (
                dot (tmpvar_230, tmpvar_230)
               - 
                (sphere_223.w * sphere_223.w)
              )));
              if ((tmpvar_233 < 0.0)) {
                tmpvar_226 = bool(0);
              } else {
                lowp float tmpvar_234;
                tmpvar_234 = sqrt(tmpvar_233);
                lowp float tmpvar_235;
                tmpvar_235 = (((
                  -(tmpvar_231)
                 + tmpvar_234) / 2.0) / tmpvar_232);
                t1_229 = tmpvar_235;
                lowp float tmpvar_236;
                tmpvar_236 = (((
                  -(tmpvar_231)
                 - tmpvar_234) / 2.0) / tmpvar_232);
                t2_228 = tmpvar_236;
                if ((tmpvar_235 < 0.001)) {
                  t1_229 = -0.001;
                };
                if ((tmpvar_236 < 0.001)) {
                  t2_228 = -0.001;
                };
                if ((t1_229 < 0.0)) {
                  tmpvar_226 = bool(0);
                } else {
                  if ((t2_228 > 0.0)) {
                    t_227 = t2_228;
                  } else {
                    t_227 = t1_229;
                  };
                  tmpvar_224 = i_221;
                  tmpvar_225 = t_227;
                  tmpvar_226 = bool(1);
                };
              };
              if ((tmpvar_226 && ((tmpvar_225 < minT_222) || (minT_222 < 0.0)))) {
                minT_222 = tmpvar_225;
                tmpvar_219 = tmpvar_224;
              };
              i_221++;
            };
            i_220 = 110;
            while (true) {
              if ((i_220 >= 124)) {
                break;
              };
              Triangle t_237;
              t_237 = triangles[(i_220 - 110)];
              highp int tmpvar_238;
              lowp float tmpvar_239;
              bool tmpvar_240;
              lowp float t1_241;
              lowp float v_242;
              lowp float u_243;
              lowp float invDet_244;
              lowp vec3 T_245;
              vec3 e2_246;
              vec3 e1_247;
              e1_247 = (t_237.B - t_237.A);
              e2_246 = (t_237.C - t_237.A);
              lowp vec3 tmpvar_248;
              tmpvar_248 = ((tmpvar_218.yzx * e2_246.zxy) - (tmpvar_218.zxy * e2_246.yzx));
              invDet_244 = (1.0/(dot (e1_247, tmpvar_248)));
              T_245 = (tmpvar_217 - t_237.A);
              u_243 = (dot (T_245, tmpvar_248) * invDet_244);
              if (((u_243 < 0.0) || (u_243 > 1.0))) {
                tmpvar_240 = bool(0);
              } else {
                lowp vec3 tmpvar_249;
                tmpvar_249 = ((T_245.yzx * e1_247.zxy) - (T_245.zxy * e1_247.yzx));
                v_242 = (dot (tmpvar_218, tmpvar_249) * invDet_244);
                if (((v_242 < 0.0) || ((u_243 + v_242) > 1.0))) {
                  tmpvar_240 = bool(0);
                } else {
                  t1_241 = (dot (e2_246, tmpvar_249) * invDet_244);
                  if ((t1_241 > 0.001)) {
                    tmpvar_239 = t1_241;
                    tmpvar_238 = i_220;
                    tmpvar_240 = bool(1);
                  } else {
                    tmpvar_240 = bool(0);
                  };
                };
              };
              if ((tmpvar_240 && ((tmpvar_239 < minT_222) || (minT_222 < 0.0)))) {
                minT_222 = tmpvar_239;
                tmpvar_219 = tmpvar_238;
              };
              i_220++;
            };
            vec3 tmpvar_250;
            float tmpvar_251;
            lowp vec3 tmpvar_252;
            tmpvar_250 = ground.o;
            tmpvar_251 = ground.r;
            tmpvar_252 = ground.n;
            bool tmpvar_253;
            lowp float tmpvar_254;
            bool tmpvar_255;
            lowp float tmpvar_256;
            tmpvar_256 = (dot (tmpvar_252, (tmpvar_250 - tmpvar_217)) / dot (tmpvar_252, tmpvar_218));
            if ((tmpvar_256 < 0.001)) {
              tmpvar_255 = bool(0);
            } else {
              tmpvar_254 = tmpvar_256;
              tmpvar_255 = bool(1);
            };
            if (tmpvar_255) {
              lowp vec3 tmpvar_257;
              tmpvar_257 = ((tmpvar_217 + (tmpvar_254 * tmpvar_218)) - tmpvar_250);
              lowp float tmpvar_258;
              tmpvar_258 = sqrt(dot (tmpvar_257, tmpvar_257));
              if ((tmpvar_258 > tmpvar_251)) {
                tmpvar_253 = bool(0);
              } else {
                tmpvar_253 = bool(1);
              };
            } else {
              tmpvar_253 = bool(0);
            };
            if ((tmpvar_253 && ((tmpvar_254 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_254;
              tmpvar_219 = 124;
            };
            lowp vec3 tmpvar_259;
            tmpvar_259 = skyboxBack.n;
            lowp float tmpvar_260;
            bool tmpvar_261;
            lowp float tmpvar_262;
            tmpvar_262 = (dot (tmpvar_259, (skyboxBack.q - tmpvar_217)) / dot (tmpvar_259, tmpvar_218));
            if ((tmpvar_262 < 0.001)) {
              tmpvar_261 = bool(0);
            } else {
              tmpvar_260 = tmpvar_262;
              tmpvar_261 = bool(1);
            };
            if ((tmpvar_261 && ((tmpvar_260 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_260;
              tmpvar_219 = 126;
            };
            lowp vec3 tmpvar_263;
            tmpvar_263 = skyboxDown.n;
            lowp float tmpvar_264;
            bool tmpvar_265;
            lowp float tmpvar_266;
            tmpvar_266 = (dot (tmpvar_263, (skyboxDown.q - tmpvar_217)) / dot (tmpvar_263, tmpvar_218));
            if ((tmpvar_266 < 0.001)) {
              tmpvar_265 = bool(0);
            } else {
              tmpvar_264 = tmpvar_266;
              tmpvar_265 = bool(1);
            };
            if ((tmpvar_265 && ((tmpvar_264 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_264;
              tmpvar_219 = 127;
            };
            lowp vec3 tmpvar_267;
            tmpvar_267 = skyboxFront.n;
            lowp float tmpvar_268;
            bool tmpvar_269;
            lowp float tmpvar_270;
            tmpvar_270 = (dot (tmpvar_267, (skyboxFront.q - tmpvar_217)) / dot (tmpvar_267, tmpvar_218));
            if ((tmpvar_270 < 0.001)) {
              tmpvar_269 = bool(0);
            } else {
              tmpvar_268 = tmpvar_270;
              tmpvar_269 = bool(1);
            };
            if ((tmpvar_269 && ((tmpvar_268 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_268;
              tmpvar_219 = 128;
            };
            lowp vec3 tmpvar_271;
            tmpvar_271 = skyboxLeft.n;
            lowp float tmpvar_272;
            bool tmpvar_273;
            lowp float tmpvar_274;
            tmpvar_274 = (dot (tmpvar_271, (skyboxLeft.q - tmpvar_217)) / dot (tmpvar_271, tmpvar_218));
            if ((tmpvar_274 < 0.001)) {
              tmpvar_273 = bool(0);
            } else {
              tmpvar_272 = tmpvar_274;
              tmpvar_273 = bool(1);
            };
            if ((tmpvar_273 && ((tmpvar_272 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_272;
              tmpvar_219 = 129;
            };
            lowp vec3 tmpvar_275;
            tmpvar_275 = skyboxRight.n;
            lowp float tmpvar_276;
            bool tmpvar_277;
            lowp float tmpvar_278;
            tmpvar_278 = (dot (tmpvar_275, (skyboxRight.q - tmpvar_217)) / dot (tmpvar_275, tmpvar_218));
            if ((tmpvar_278 < 0.001)) {
              tmpvar_277 = bool(0);
            } else {
              tmpvar_276 = tmpvar_278;
              tmpvar_277 = bool(1);
            };
            if ((tmpvar_277 && ((tmpvar_276 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_276;
              tmpvar_219 = 130;
            };
            lowp vec3 tmpvar_279;
            tmpvar_279 = skyboxUp.n;
            lowp float tmpvar_280;
            bool tmpvar_281;
            lowp float tmpvar_282;
            tmpvar_282 = (dot (tmpvar_279, (skyboxUp.q - tmpvar_217)) / dot (tmpvar_279, tmpvar_218));
            if ((tmpvar_282 < 0.001)) {
              tmpvar_281 = bool(0);
            } else {
              tmpvar_280 = tmpvar_282;
              tmpvar_281 = bool(1);
            };
            if ((tmpvar_281 && ((tmpvar_280 < minT_222) || (minT_222 < 0.0)))) {
              minT_222 = tmpvar_280;
              tmpvar_219 = 131;
            };
            if ((((
              (((tmpvar_219 != 0) && (tmpvar_219 != 5)) && (tmpvar_219 != 6))
             && 
              (tmpvar_219 != 124)
            ) && (tmpvar_219 != tmpvar_200)) && (tmpvar_200 <= 124))) {
              specular_204 = vec3(0.0, 0.0, 0.0);
              diffuse_205 = vec3(0.0, 0.0, 0.0);
            };
          };
          color_206 = (color_206 + (diffuse_205 + specular_204));
          j_203++;
        };
        tmpvar_199 = color_206;
      };
      color_15 = (color_15 + (tmpvar_199 * coeff_4));
      if ((tmpvar_18 == 0)) {
        float tmpvar_283;
        tmpvar_283 = (time / 5.0);
        u_9 = (u_9 + tmpvar_283);
        v_8 = (v_8 + tmpvar_283);
        lowp vec2 tmpvar_284;
        tmpvar_284.x = u_9;
        tmpvar_284.y = v_8;
        color_15 = (color_15 * (texture (sunTexture, tmpvar_284).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_18 == 3)) {
          if (!(useNormalMap)) {
            u_9 = (u_9 + (time / 2.0));
          };
          lowp vec2 tmpvar_285;
          tmpvar_285.x = u_9;
          tmpvar_285.y = v_8;
          color_15 = (color_15 * texture (earthTexture, tmpvar_285).xyz);
        } else {
          if ((tmpvar_18 == 4)) {
            if (!(useNormalMap)) {
              u_9 = (u_9 + (time / 7.0));
            };
            lowp vec2 tmpvar_286;
            tmpvar_286.x = u_9;
            tmpvar_286.y = v_8;
            color_15 = (color_15 * texture (moonTexture, tmpvar_286).xyz);
          } else {
            if ((tmpvar_18 == 124)) {
              color_15 = (color_15 * texture (groundTexture, (0.15 * tmpvar_20.xz)).xyz);
            } else {
              if ((tmpvar_18 == 126)) {
                color_15 = (color_15 * texture (skyboxTextureBack, ((
                  -(tmpvar_20.xy)
                 + vec2(
                  (skyboxRatio / 2.0)
                )) / skyboxRatio)).xyz);
              } else {
                if ((tmpvar_18 == 127)) {
                  color_15 = (color_15 * texture (skyboxTextureDown, ((tmpvar_20.xz + vec2(
                    (skyboxRatio / 2.0)
                  )) / skyboxRatio)).xyz);
                } else {
                  if ((tmpvar_18 == 128)) {
                    color_15 = (color_15 * texture (skyboxTextureFront, ((
                      (tmpvar_20.xy * vec2(1.0, -1.0))
                     + vec2(
                      (skyboxRatio / 2.0)
                    )) / skyboxRatio)).xyz);
                  } else {
                    if ((tmpvar_18 == 129)) {
                      color_15 = (color_15 * texture (skyboxTextureLeft, ((tmpvar_20.yz + vec2(
                        (skyboxRatio / 2.0)
                      )) / skyboxRatio)).xyz);
                    } else {
                      if ((tmpvar_18 == 130)) {
                        color_15 = (color_15 * texture (skyboxTextureRight, ((
                          (tmpvar_20.zy * vec2(1.0, -1.0))
                         + vec2(
                          (skyboxRatio / 2.0)
                        )) / skyboxRatio)).xyz);
                      } else {
                        if ((tmpvar_18 == 131)) {
                          color_15 = (color_15 * texture (skyboxTextureUp, ((tmpvar_20.xz + vec2(
                            (skyboxRatio / 2.0)
                          )) / skyboxRatio)).xyz);
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      bool tmpvar_287;
      tmpvar_287 = (((tmpvar_18 == 3) && (color_15.z > color_15.x)) && (color_15.z > color_15.y));
      if ((((tmpvar_195 || tmpvar_194) || tmpvar_287) && (bounceCount_5 <= depth))) {
        bool totalInternalReflection_288;
        totalInternalReflection_288 = bool(0);
        if (tmpvar_194) {
          Ray refractedRay_289;
          float tmpvar_290;
          tmpvar_290 = (1.0/(tmpvar_197));
          lowp float tmpvar_291;
          tmpvar_291 = dot (ray_1.dir, tmpvar_13);
          lowp vec3 tmpvar_292;
          if ((tmpvar_291 <= 0.0)) {
            vec3 I_293;
            I_293 = ray_1.dir;
            lowp vec3 tmpvar_294;
            lowp float tmpvar_295;
            tmpvar_295 = dot (tmpvar_13, I_293);
            lowp float tmpvar_296;
            tmpvar_296 = (1.0 - (tmpvar_290 * (tmpvar_290 * 
              (1.0 - (tmpvar_295 * tmpvar_295))
            )));
            if ((tmpvar_296 < 0.0)) {
              tmpvar_294 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_294 = ((tmpvar_290 * I_293) - ((
                (tmpvar_290 * tmpvar_295)
               + 
                sqrt(tmpvar_296)
              ) * tmpvar_13));
            };
            tmpvar_292 = tmpvar_294;
          } else {
            vec3 I_297;
            I_297 = ray_1.dir;
            lowp vec3 N_298;
            N_298 = -(tmpvar_13);
            float eta_299;
            eta_299 = (1.0/(tmpvar_290));
            lowp vec3 tmpvar_300;
            lowp float tmpvar_301;
            tmpvar_301 = dot (N_298, I_297);
            lowp float tmpvar_302;
            tmpvar_302 = (1.0 - (eta_299 * (eta_299 * 
              (1.0 - (tmpvar_301 * tmpvar_301))
            )));
            if ((tmpvar_302 < 0.0)) {
              tmpvar_300 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_300 = ((eta_299 * I_297) - ((
                (eta_299 * tmpvar_301)
               + 
                sqrt(tmpvar_302)
              ) * N_298));
            };
            tmpvar_292 = tmpvar_300;
          };
          refractedRay_289.dir = tmpvar_292;
          vec3 x_303;
          x_303 = refractedRay_289.dir;
          totalInternalReflection_288 = (sqrt(dot (x_303, x_303)) < 0.001);
          if (totalInternalReflection_288) {
            vec3 I_304;
            I_304 = ray_1.dir;
            lowp vec3 N_305;
            N_305 = -(tmpvar_13);
            ray_1.dir = normalize((I_304 - (2.0 * 
              (dot (N_305, I_304) * N_305)
            )));
            ray_1.origin = (tmpvar_20 - (tmpvar_13 * 0.001));
          } else {
            refractedRay_289.origin = (tmpvar_20 + ((tmpvar_13 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_13)
            )));
            refractedRay_289.dir = normalize(refractedRay_289.dir);
            if (!(tmpvar_195)) {
              ray_1 = refractedRay_289;
            } else {
              stack_7[stackSize_6].coeff = (coeff_4 * (vec3(1.0, 1.0, 1.0) - (tmpvar_196 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_196) * pow ((1.0 - abs(
                  dot (tmpvar_13, refractedRay_289.dir)
                )), 5.0))
              )));
              stack_7[stackSize_6].depth = bounceCount_5;
              highp int tmpvar_306;
              tmpvar_306 = stackSize_6;
              stackSize_6++;
              stack_7[tmpvar_306].ray = refractedRay_289;
            };
          };
        };
        if (((tmpvar_195 && !(totalInternalReflection_288)) || tmpvar_287)) {
          lowp float tmpvar_307;
          tmpvar_307 = dot (ray_1.dir, tmpvar_13);
          if ((tmpvar_307 < 0.0)) {
            coeff_4 = (coeff_4 * (tmpvar_196 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_196)
             * 
              pow ((1.0 - abs(dot (tmpvar_13, ray_1.dir))), 5.0)
            )));
            vec3 I_308;
            I_308 = ray_1.dir;
            ray_1.dir = normalize((I_308 - (2.0 * 
              (dot (tmpvar_13, I_308) * tmpvar_13)
            )));
            ray_1.origin = (tmpvar_20 + (tmpvar_13 * 0.001));
          } else {
            continueLoop_3 = bool(0);
          };
        };
      } else {
        continueLoop_3 = bool(0);
      };
    } else {
      color_15 = (color_15 + (vec3(0.6, 0.75, 0.9) * coeff_4));
      continueLoop_3 = bool(0);
    };
    if (isGlowOn) {
      vec3 glowness_309;
      vec3 tmpvar_310;
      tmpvar_310 = normalize(ray_1.dir);
      vec3 tmpvar_311;
      tmpvar_311 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_310)
      ) * tmpvar_310));
      float tmpvar_312;
      tmpvar_312 = sqrt(dot (tmpvar_311, tmpvar_311));
      lowp float tmpvar_313;
      lowp vec3 x_314;
      x_314 = (tmpvar_20 - eye);
      tmpvar_313 = sqrt(dot (x_314, x_314));
      float tmpvar_315;
      vec3 x_316;
      x_316 = (spheres[0].xyz - eye);
      tmpvar_315 = sqrt(dot (x_316, x_316));
      if (((tmpvar_313 + spheres[0].w) < tmpvar_315)) {
        glowness_309 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_309 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_312 * tmpvar_312))
        ), 0.0, 1.0));
      };
      color_15 = (color_15 + glowness_309);
    };
    if ((!(continueLoop_3) && (stackSize_6 > 0))) {
      highp int tmpvar_317;
      tmpvar_317 = (stackSize_6 - 1);
      stackSize_6 = tmpvar_317;
      ray_1 = stack_7[tmpvar_317].ray;
      bounceCount_5 = stack_7[tmpvar_317].depth;
      coeff_4 = stack_7[tmpvar_317].coeff;
      continueLoop_3 = bool(1);
    };
    i_2++;
  };
  lowp vec4 tmpvar_318;
  tmpvar_318.w = 1.0;
  tmpvar_318.x = color_15[colorModeInTernary[0]];
  tmpvar_318.y = color_15[colorModeInTernary[1]];
  tmpvar_318.z = color_15[colorModeInTernary[2]];
  fragColor = tmpvar_318;
}